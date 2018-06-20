// load the things we need
const mongoose = require('mongoose');
var schema = require('./user');
var userSchema = schema.User;

const groupeSchema = new mongoose.Schema({
    
  id: {
    type: String,
    required: true
  },
  nomGroupe: {
    type: String,
    required: true
  },
  userEvaluateurEnCharge: {
    type: [userSchema],
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
    type: [userSchema],
    required: true
  },
  
  groupes: {
    type: [groupeSchema],
    required: true
  }
});

const gammeDeNotesSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
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
  id: {
    type: String,
    required: true
  },
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
    type: [gammeDeNotesSchema],
    required: true
  }
});

const evaluationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
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
    type: [userSchema],
    required: true
  },
//  groupeEvalue: {
//    type: [groupeEvalueSchema],
//    required: true
//  }
});

const groupeEvalueSchema = new mongoose.Schema({
  groupes: {
    type: [groupeSchema],
    required: true
  },
  evaluations: {
    type: [evaluationSchema],
    required: true
  },
  noteGlobale: {
    type: String,
    required: true
  },
  commentaire: {
    type: String,
    required: true
  }
});

const criteresEvaluationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  nomCritere: {
    type: String,
    required: true
  },
  evaluation: {
    type: [evaluationSchema],
    required: true
  },
//  notesCriteresGroupes: {
//    type: [notesCriteresGroupeSchema],
//    required: true
//  }
});

const notesCriteresGroupeSchema = new mongoose.Schema({
  groupes: {
    type: [groupeSchema],
    required: true
  },
  criteres: {
    type: [criteresEvaluationSchema],
    required: true
  },
  noteCritere: {
    type: String,
    required: true
  },
  commentaire: {
    type: String,
    required: true
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

