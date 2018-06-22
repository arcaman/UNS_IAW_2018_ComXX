// load the things we need
const mongoose = require('mongoose');
var schema = require('./user');
var userSchema = schema.User;

const groupeSchema = new mongoose.Schema({
  
  nomGroupe: {
    type: String,
    required: true
  },
  userEvaluateurEnCharge: {
    type: String,
    required: true
  },
//  personnesDansGroupe: {
//    type: [personnesDansGroupeSchema],
//    required: true
//  },
  
//  groupeEvalue: {
//    type: [groupeEvalueSchema],
//    required: true
//  },
//  
//  notesCriteresGroupes: {
//    type: [notesCriteresGroupeSchema],
//    required: true
//  }
});

const personnesDansGroupeSchema = new mongoose.Schema({
  users: {
    type: String,
    required: true
  },
  
  groupes: {
    type: String,
    required: true
  }
});

const gammeDeNotesSchema = new mongoose.Schema({
  
  nom: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const tableDeNotesSchema = new mongoose.Schema({
  abreviation: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  opinion: {
    type: String,
    required: true
  },
  resultat: { //aprobado, desaprobado
    type: String,
    required: true
  },
  gammesDeNotes: {
    type: String,
    required: true
  }
});

const evaluationSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: { //PARTIEL, PROJET, RATTRAPAGE
    type: String,
    required: true
  },
  userAdminCreateur: {
    type: String,
    required: true
  },
//  groupeEvalue: {
//    type: [groupeEvalueSchema],
//    required: true
//  }
});

const groupeEvalueSchema = new mongoose.Schema({
  groupes: {
    type: String,
    required: true
  },
  evaluations: {
    type: String,
    required: true
  },
  noteGlobale: {
    type: String,
    required: true
  },
  commentaire: {
    type: String,
    required: false
  }
});

const criteresEvaluationSchema = new mongoose.Schema({
  nomCritere: {
    type: String,
    required: true
  },
  evaluation: {
    type: String,
    required: true
  },
//  notesCriteresGroupes: {
//    type: [notesCriteresGroupeSchema],
//    required: true
//  }
});

const notesCriteresGroupeSchema = new mongoose.Schema({
  groupes: {
    type: String,
    required: true
  },
  criteres: {
    type: String,
    required: true
  },
  noteCritere: {
    type: String,
    required: true
  },
  commentaire: {
    type: String,
    required: false
  }
  
});

module.exports = mongoose.model('Groupe', groupeSchema);
module.exports = mongoose.model('PersonnesDansGroupe', personnesDansGroupeSchema);
module.exports = mongoose.model('GammeDeNotes', gammeDeNotesSchema);
module.exports = mongoose.model('TableDeNotes', tableDeNotesSchema);
module.exports = mongoose.model('Evaluation', evaluationSchema);
module.exports = mongoose.model('GroupeEvalue', groupeEvalueSchema);
module.exports = mongoose.model('CriteresEvaluation', criteresEvaluationSchema);
module.exports = mongoose.model('NotesCriteresGroupe', notesCriteresGroupeSchema);

