-- Activar extensión necesaria para gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Crear tabla de ganaderías (tenants)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  tenant_id UUID REFERENCES tenants(id),
  user_type VARCHAR(50) DEFAULT 'user', -- 'user', 'veterinarian', 'admin'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Crear tabla de relación veterinarios-ganaderías
CREATE TABLE IF NOT EXISTS veterinarian_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  tenant_id UUID REFERENCES tenants(id),
  permissions VARCHAR(255), -- 'read', 'write', 'full'
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, tenant_id)
);

-- Crear tabla de animales
CREATE TABLE IF NOT EXISTS animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- 'toro', 'vaca', 'becerro'
  sex VARCHAR(10), -- 'male', 'female'
  breed VARCHAR(255),
  birth_date DATE,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'retired', 'sold'
  is_active BOOLEAN DEFAULT true,
  code VARCHAR(100),
  crotal VARCHAR(100),
  resena TEXT,
  mother_code VARCHAR(100),
  mother_name VARCHAR(255),
  father_code VARCHAR(100),
  father_name VARCHAR(255),
  reg VARCHAR(50),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Crear tabla de registros veterinarios
CREATE TABLE IF NOT EXISTS veterinary_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES animals(id) NOT NULL,
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  veterinarian_id UUID REFERENCES users(id),
  record_date DATE NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Insertar ganadería de ejemplo
INSERT INTO tenants (name, location, description)
VALUES (
  'Valdelapeña',
  'Córdoba, España',
  'Ganadería histórica de toros de lidia'
) ON CONFLICT DO NOTHING;

-- Obtener el ID de la ganadería para usarlo en el usuario
DO $$
DECLARE
  tenant_id UUID;
BEGIN
  SELECT id INTO tenant_id FROM tenants WHERE name = 'Valdelapeña';
  
  -- Insertar usuario de ejemplo (isaez / ManoloSanchis)
  -- Hash generado con: bcryptjs.hash('ManoloSanchis', 10)
  INSERT INTO users (email, password, full_name, tenant_id, user_type)
  VALUES (
    'isaez@valdelapena.es',
    '$2a$10$ica3NbDji61W73es7OoB.e0zt1/wBwFQD8lU4oy/smUliF2z0/Ita', -- bcrypt hash de ManoloSanchis
    'Ignacio Sáez',
    tenant_id,
    'user'
  ) ON CONFLICT (email) DO NOTHING;
END $$;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_animals_tenant_id ON animals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_veterinary_records_tenant_id ON veterinary_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_veterinary_records_animal_id ON veterinary_records(animal_id);
CREATE INDEX IF NOT EXISTS idx_veterinarian_tenants_user_id ON veterinarian_tenants(user_id);
