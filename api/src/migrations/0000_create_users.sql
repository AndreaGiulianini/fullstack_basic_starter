CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" varchar(255),
	"password" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);