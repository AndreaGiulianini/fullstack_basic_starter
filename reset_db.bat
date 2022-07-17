@echo off

docker exec mysql bash -c "mysql -h localhost -u root -p$MYSQL_ROOT_PASSWORD -D demo -s -N -e \"SET SESSION group_concat_max_len = 8192; SET @t = COALESCE( ( SELECT CONCAT('drop table ', GROUP_CONCAT(a.table_name)) FROM information_schema.tables a WHERE a.table_schema = 'demo' AND a.table_type = 'BASE TABLE' ), 'SELECT 1;' ); PREPARE s FROM @t; SET FOREIGN_KEY_CHECKS = 0; EXECUTE s; SET FOREIGN_KEY_CHECKS = 1;\""
docker exec api npm run migrate_development
docker exec api npm run seed_development
