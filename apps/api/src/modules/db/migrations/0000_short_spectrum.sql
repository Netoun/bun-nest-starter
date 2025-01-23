CREATE TABLE `todo` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`completed` integer DEFAULT false NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `todo` (`user_id`);--> statement-breakpoint
CREATE INDEX `completed_user_id_idx` ON `todo` (`completed`,`user_id`);--> statement-breakpoint
CREATE INDEX `todo_created_at_idx` ON `todo` (`created_at`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `user` (`created_at`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `user` (`name`);