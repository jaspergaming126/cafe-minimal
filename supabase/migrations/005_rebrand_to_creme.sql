-- Migration 005: Rebrand to CRÈME.ge
-- Updates the existing configuration to reflect the new brand name.

-- Update the app_config table for the single configuration row (id=1)
UPDATE app_config
SET 
    brand_name = 'CRÈME.ge',
    footer_text = '© 2026 CRÈME.ge. All rights reserved.'
WHERE id = 1;
