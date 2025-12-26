INSERT INTO contacts (label, value, kind, sort_order) VALUES
('Vertrieb', 'hallo@example.com', 'email', 1),
('Telefon', '+49 0000 000000', 'phone', 2),
('Doku', 'https://example.com/docs', 'link', 3);

INSERT INTO customers (name, contact_email, contact_phone) VALUES
('Acme Immobilien', 'acme@example.com', '+49 1111 222333'),
('Bright Dienstleistungen', 'bright@example.com', '+49 2222 333444');

-- Passworthash unten ist bcrypt für "admin123"
INSERT INTO users (email, password_hash, role) VALUES
('admin@example.com', '$2a$10$5g7gqVnrn3H2l18jU68FHONuZGhH8wwzF0r0gSAlZwpEKa2ERjP3S', 'admin');
