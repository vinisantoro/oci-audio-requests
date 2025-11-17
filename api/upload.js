// Lista de emails permitidos - EMBARCADA NO CÓDIGO (não exposta como arquivo estático)
const allowedEmails = [
  "alessandra.lima@oracle.com",
  "alex.takata@oracle.com",
  "andre.guedes@oracle.com",
  "braulio.galo@oracle.com",
  "edgar.e.araujo@oracle.com",
  "edvar.zandonade@oracle.com",
  "humberto.corbellini@oracle.com",
  "judivan.lucena@oracle.com",
  "lucas.cordeiro@oracle.com",
  "ricardo.felippeto@oracle.com",
  "rodrigo.loureiro@oracle.com",
  "thiago.ramalho@oracle.com",
  "tiago.rangel@oracle.com",
  "vitor.porto@oracle.com",
  "carlos.cm.miranda@oracle.com",
  "decio.domingues@oracle.com",
  "carlos.eduardo.santos@oracle.com",
  "eduardo.marcarini@oracle.com",
  "fernanda.carelo@oracle.com",
  "gabriel.yoshino@oracle.com",
  "givaldo.neto@oracle.com",
  "leonardo.s.silva@oracle.com",
  "marcel.rosa@oracle.com",
  "raphael.buzzi@oracle.com",
  "francis.yonemura@oracle.com",
  "herbert.marczewski@oracle.com",
  "lisboa.junior@oracle.com",
  "anderson.moreira@oracle.com",
  "eduardo.niel@oracle.com",
  "fernanda.pecarara@oracle.com",
  "gisely.rodrigues@oracle.com",
  "heder.oliveira@oracle.com",
  "humberto.siqueira@oracle.com",
  "lucio.vieira@oracle.com",
  "marcelo.r.novaes@oracle.com",
  "lucas.costa@oracle.com",
  "marcio.ferraz@oracle.com",
  "deborah.araujo@oracle.com",
  "diego.a.lima@oracle.com",
  "mauro.madela@oracle.com",
  "raul.xavier@oracle.com",
  "regis.pavinato@oracle.com",
  "ricardo.y.kobara@oracle.com",
  "salvador.junior@oracle.com",
  "thais.cavalcanti@oracle.com",
  "william.m.santos@oracle.com",
  "thiago.francisco@oracle.com",
  "victor.filho@oracle.com",
  "bruno.francisco@oracle.com",
  "carlos.monari@oracle.com",
  "daniel.bastos@oracle.com",
  "gustavo.torres@oracle.com",
  "luiz.stellato@oracle.com",
  "oscar.neto@oracle.com",
  "vitor.t.barbosa@oracle.com",
  "amadeo.cejas@oracle.com",
  "aristides.adame@oracle.com",
  "ernesto.mosqueda@oracle.com",
  "fernanda.arce@oracle.com",
  "ivan.p.romero@oracle.com",
  "aline.panama@oracle.com",
  "dina.trinidad@oracle.com",
  "jose.luis.gonzalez.cruz@oracle.com",
  "laura.contreras@oracle.com",
  "marco.jimenez@oracle.com",
  "maria.r.reyes@oracle.com",
  "martha.galicia@oracle.com",
  "norma.carballo@oracle.com",
  "marcela.delius@oracle.com",
  "alvaro.guauque@oracle.com",
  "camilo.tellez@oracle.com",
  "elena.chaves@oracle.com",
  "felix.galeano.cruz@oracle.com",
  "jonathan.sanabria@oracle.com",
  "mauricio.r.rojas@oracle.com",
  "nestor.santos@oracle.com",
  "ricardo.r.rodriguez@oracle.com",
  "taide.blanco@oracle.com",
  "cecilia.cirigliano@oracle.com",
  "edson.villaizan@oracle.com",
  "esteban.benvenuto@oracle.com",
  "leonardo.muz@oracle.com",
  "nadin.kocuper@oracle.com",
  "nathaly.rodriguez@oracle.com",
  "alexander.l.lopez@oracle.com",
  "alvaro.rueda@oracle.com",
  "andres.falla@oracle.com",
  "carlos.cc.cortes@oracle.com",
  "carolina.guerrero@oracle.com",
  "johana.polania@oracle.com",
  "leonardo.beltran@oracle.com",
  "fabiano.matos@oracle.com",
  "fernando.mendoza@oracle.com",
  "eric.valderrama@oracle.com",
  "felipe.basso@oracle.com",
  "fernando.almeida@oracle.com",
  "javier.avalos@oracle.com",
  "javier.avendano@oracle.com",
  "jorge.peralta@oracle.com",
  "marcio.miyazima@oracle.com",
  "rakesh.dadlani@oracle.com",
  "anderson.a.silva@oracle.com",
  "angelica.o.oliveira@oracle.com",
  "guilherme.raber@oracle.com",
  "leandro.camara@oracle.com",
  "linda.m.martinez@oracle.com",
  "rodrigo.b.reis@oracle.com",
  "sergio.ariza@oracle.com",
  "tayna.salvador@oracle.com",
  "vinicius.aguiar@oracle.com",
  "william.o.oliveira@oracle.com",
  "arturo.a.lopez@oracle.com",
  "gabriel.comenale@oracle.com",
  "helber.marcondes@oracle.com",
  "joao.jo.silva@oracle.com",
  "juan.figueroa@oracle.com",
  "juliana.cambrais@oracle.com",
  "mateo.saravia@oracle.com",
  "matheus.rocha@oracle.com",
  "tiago.priviero@oracle.com",
  "vinicius.fernandes@oracle.com",
  "andrews.s.santos@oracle.com",
  "gustavo.barros@oracle.com",
  "jenner.b.borges@oracle.com",
  "katia.kolling@oracle.com",
  "mairanny.ascanio@oracle.com",
  "mauricio.s.sarai@oracle.com",
  "renato.barros@oracle.com",
  "danilo.a.silva@oracle.com",
  "gabriel.p.carvalho@oracle.com",
  "lucio.rivera@oracle.com",
  "marcio.ventura@oracle.com",
  "miguel.miranda@oracle.com",
  "rodrigo.nunez@oracle.com",
  "ronaldo.silva@oracle.com",
  "daniel.armbrust@oracle.com",
  "ivens.rocha@oracle.com",
  "joao.molina@oracle.com",
  "paulina.bolanos@oracle.com",
  "ricardo.d.carrillo@oracle.com",
  "silvio.da.silva@oracle.com",
  "vinicius.correa@oracle.com",
  "wesley.ellwanger@oracle.com",
  "marcos.julien@oracle.com",
  "agustin.l.lozano@oracle.com",
  "anthoni.almeida@oracle.com",
  "augusto.aguiar@oracle.com",
  "javier.valenzuela@oracle.com",
  "jose.montero@oracle.com",
  "juliana.p.pires@oracle.com",
  "laercio.francisco@oracle.com",
  "raul.i.gonzalez@oracle.com",
  "saulo.p.pereira@oracle.com",
  "tiago.macedo@oracle.com",
];

const allowedEmailSet = new Set(
  allowedEmails.map((email) => email.toLowerCase())
);

// Função auxiliar para ler o body como buffer quando bodyParser está desabilitado
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  // Permitir apenas método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-uploader-email');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const uploaderEmail = req.headers['x-uploader-email'];
    const OCI_UPLOAD_URL = process.env.OCI_UPLOAD_URL;

    // Validar email do uploader
    if (!uploaderEmail) {
      return res.status(400).json({ 
        error: 'Email do uploader é obrigatório' 
      });
    }

    const normalizedEmail = uploaderEmail.trim().toLowerCase();
    
    if (!allowedEmailSet.has(normalizedEmail)) {
      return res.status(403).json({ 
        error: 'Email não autorizado para upload' 
      });
    }

    // Validar URL do OCI
    if (!OCI_UPLOAD_URL) {
      console.error('OCI_UPLOAD_URL não configurado');
      return res.status(500).json({ 
        error: 'Configuração do servidor incompleta' 
      });
    }

    // Ler o body como buffer (bodyParser está desabilitado)
    const audioData = await getRawBody(req);

    if (!audioData || audioData.length === 0) {
      return res.status(400).json({ 
        error: 'Dados de áudio vazios' 
      });
    }

    const contentType = req.headers['content-type'] || 'application/octet-stream';

    // Gerar nome do arquivo
    const safeEmail = normalizedEmail.replace(/[^a-z0-9._-]/g, '-');
    const fileName = `${safeEmail}-${Date.now()}.webm`;
    const encodedName = encodeURIComponent(fileName);
    
    // Construir URL de upload
    const trimmedUrl = OCI_UPLOAD_URL.trim();
    const endsWithSlash = trimmedUrl.endsWith('/');
    const uploadUrl = `${trimmedUrl}${endsWithSlash ? '' : '/'}${encodedName}`;

    // Fazer upload para OCI
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'x-object-meta-uploader-email': normalizedEmail,
      },
      body: audioData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text().catch(() => 'Erro desconhecido');
      console.error('Erro no upload para OCI:', uploadResponse.status, errorText);
      return res.status(uploadResponse.status).json({ 
        error: `Falha no upload: ${uploadResponse.status}` 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Upload concluído com sucesso',
      fileName: fileName
    });

  } catch (error) {
    console.error('Erro no upload:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor durante o upload' 
    });
  }
};

