import bcrypt from 'bcryptjs';

const generatePasswordHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

// Para la contraseña de prueba: ManoloSanchis
(async () => {
  try {
    const passwordHash = await generatePasswordHash('ManoloSanchis');
    console.log('Hash para contraseña "ManoloSanchis":');
    console.log(passwordHash);
    console.log('\nUsa este hash en el init.sql en la columna password');
  } catch (error) {
    console.error('Error:', error);
  }
})();
