// Configuração para a função de upload na Vercel
// Desabilita o body parser para permitir dados binários (blob/audio)
module.exports = {
  api: {
    bodyParser: false,
  },
};

