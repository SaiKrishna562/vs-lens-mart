ALTER TABLE "frames" ADD COLUMN "tryon_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "frames" ADD COLUMN "tryon_path" text;--> statement-breakpoint
ALTER TABLE "frames" ADD COLUMN "tryon_lens_left" real DEFAULT 0.27 NOT NULL;--> statement-breakpoint
ALTER TABLE "frames" ADD COLUMN "tryon_lens_right" real DEFAULT 0.73 NOT NULL;--> statement-breakpoint
ALTER TABLE "frames" ADD COLUMN "tryon_lens_y" real DEFAULT 0.48 NOT NULL;--> statement-breakpoint
ALTER TABLE "frames" ADD CONSTRAINT "frames_tryon_needs_picture" CHECK (not "frames"."tryon_enabled" or "frames"."tryon_path" is not null);--> statement-breakpoint
ALTER TABLE "frames" ADD CONSTRAINT "frames_tryon_lenses" CHECK ("frames"."tryon_lens_left" > 0 and "frames"."tryon_lens_left" < "frames"."tryon_lens_right" and "frames"."tryon_lens_right" < 1 and "frames"."tryon_lens_y" > 0 and "frames"."tryon_lens_y" < 1);