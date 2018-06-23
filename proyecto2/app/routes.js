// app/routes.js

module.exports = function (app, passport) {

// route for home page
    app.get('/', function (req, res) {
        res.render('index.twig', {
            user: req.user // get the user out of session and pass to template
        });
    });
    // route for showing the profile page
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.twig', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // route para menejar los estilos por el usario
    app.get('/estilo', isLoggedIn, function (req, res) {
        res.render('estilo.twig', {
            user: req.user // get the user out of session and pass to template
        });
    });
    // route para menejar los estilos por el usario
    app.get('/escogeestilo', isLoggedIn, function (req, res) {
        var mongoose = require('mongoose');
        var style = req.param("style");
        console.log(style);
        //update de l'user
        var User = mongoose.model('User');
        User.findOne({"google.id": req.user.google.id}, function (err, object) {
            object.local.layout = style;
            object.save();
        });
        res.json(style);
    });
    // route for logging out
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    // facebook routes
    // twitter routes

    app.get('/alumno', isLoggedIn, function (req, res) {

        //verificacion si es un alumno. Si no, error
        if (req.user.local.type_user != "ALUMNO") {
            res.status(403).json("El usuario no es un ALUMNO. Prohibido !");
        }

        var mongoose = require('mongoose');
        var PersonnesDansGroupe = mongoose.model('PersonnesDansGroupe');
        //recuperer tous les groupes de l'utilisateur
        PersonnesDansGroupe.find({"users": req.user._id}, function (err, listeGroupe) {
            // console.log("LISTING DES PERSONNES DANS LES GROUPES");

            if (err) {
                throw err;
            }

            //comms est un tableau de hash
            var listeDetailGroupeGeneral = [];
            var Groupe = mongoose.model('Groupe');
            var indiceControleRequete = listeGroupe.length;
            //pour chaque groupe, recuperer les informations detaillees du groupe (nom et id)
            listeGroupe.forEach(function (valeur, indice) {
                Groupe.find({"_id": listeGroupe[indice].groupes}, function (err, listeDetailGroupe) {
                    listeDetailGroupeGeneral[indice] = listeDetailGroupe;
                    indiceControleRequete--;
                    //attendre qu'on ai bien tout recupere pour sortir de la boucle avec les donnees
                    if (indiceControleRequete == 0) {
                        callbackRequete();
                    }

                });
            });
            function callbackRequete() {

                console.log("LISTE DES GROUPES DE L'UTILISATEUR");
                console.log(listeGroupe);
                console.log("DETAIL DE CHAQUE GROUPE DE L UTILISATEUR");
                console.log(listeDetailGroupeGeneral);
                indiceControleRequeteEval = listeGroupe.length;
                var GroupeEvalue = mongoose.model('GroupeEvalue');
                listeEvalsParGroupeGeneral = [];

                //recuperer le lien entre les groupes et les evaluations associees
                listeGroupe.forEach(function (valeur, indice) {
                    console.log(indice);
                    GroupeEvalue.find({"groupes": listeGroupe[indice].groupes}, function (err, listeEvalsParGroupe) {


                        //console.log(listeEvalsParGroupe);
                        listeEvalsParGroupeGeneral[indice] = listeEvalsParGroupe;
                        indiceControleRequeteEval--;
                        //attendre qu'on ai bien tout recupere pour sortir de la boucle avec les donnees
                        if (indiceControleRequeteEval == 0) {
                            callbackRequeteEvaluation();
                        }

                    });
                });

            }
            function callbackRequeteEvaluation() {

                console.log("RESULTAT DE TOUTES LES EVALLUATIONS");
                console.log(listeEvalsParGroupeGeneral);

                //jusquici tout est ok

                //pour avoir le nombre d evals total qu il y a dans toutes les cases du tableau
                var indiceControleRequeteDetailEvaluation = 0;
                var Evaluation = mongoose.model('Evaluation');
                var listeOrdonneeEval = [];
                for (var indiceControleGroupe = 0; indiceControleGroupe < listeEvalsParGroupeGeneral.length; indiceControleGroupe++) {
                    for (var indiceControleEval = 0; indiceControleEval < listeEvalsParGroupeGeneral[indiceControleGroupe].length; indiceControleEval++) {

                        listeOrdonneeEval[indiceControleRequeteDetailEvaluation] = listeEvalsParGroupeGeneral[indiceControleGroupe][indiceControleEval].evaluations;
                        indiceControleRequeteDetailEvaluation++;
                    }
                }

                console.log(listeOrdonneeEval);
                listeDetailEvalGeneral = [];

                listeOrdonneeEval.forEach(function (valeur, indice) {
                    console.log(indice);
                    Evaluation.find({"_id": listeOrdonneeEval[indice]}, function (err, listeDetailEval) {


                        //console.log(listeEvalsParGroupe);
                        listeDetailEvalGeneral[indice] = listeDetailEval;
                        indiceControleRequeteDetailEvaluation--;
                        //attendre qu'on ai bien tout recupere pour sortir de la boucle avec les donnees
                        if (indiceControleRequeteDetailEvaluation == 0) {
                            callbackRequeteRender();
                        }

                    });
                });

                function callbackRequeteRender() {

                    console.log("QUEL EST L ORDRE DE LA LISTE ?");
                    console.log(listeDetailEvalGeneral);

                    res.render('alumno.twig', {
                        user: req.user, // get the user out of session and pass to template
                        listeDetailGroupeGeneral: listeDetailGroupeGeneral,
                        listeEvalsParGroupeGeneral: listeEvalsParGroupeGeneral,
                        listeDetailEvalGeneral: listeDetailEvalGeneral
                    });

                }

            }
        });

    });

    app.get('/consultacriteriosalumno', isLoggedIn, function (req, res) {

        //verificacion si es un alumno. Si no, error
        if (req.user.local.type_user != "ALUMNO") {
            res.status(403).json("El usuario no es un ALUMNO. Prohibido !");
        }

        var mongoose = require('mongoose');
        var idEvaluation = req.param("idEvaluation");
        var idGroupe = req.param("idGroupe");
        console.log(idEvaluation);
        console.log(idGroupe);

        var mongoose = require('mongoose');
        var Groupe = mongoose.model('Groupe');
        var Evaluation = mongoose.model('Evaluation');
        var GroupeEvalue = mongoose.model('GroupeEvalue');
        var CriteresEvaluation = mongoose.model('CriteresEvaluation');
        var NotesCriteresGroupe = mongoose.model('NotesCriteresGroupe');


        //recuperer les infos du groupe
        Groupe.find({"_id": idGroupe}, function (err, objGroupe) {
            if (err) {
                throw err;
            }
            console.log(objGroupe);
            //recuperer les infos de l evaluation
            Evaluation.find({"_id": idEvaluation}, function (err, objEvaluation) {
                console.log(objEvaluation);

                //recuperer les infos du groupe evalue
                GroupeEvalue.find({"groupes": idGroupe, "evaluations": idEvaluation}, function (err, objGroupeEvalue) {
                    console.log(objGroupeEvalue);

                    //recuperer les criteres d evaluation de l evaluation
                    CriteresEvaluation.find({"evaluation": idEvaluation}, function (err, listeCriteres) {
                        console.log(listeCriteres);

                        //comms est un tableau de hash
                        var listeNotesCriteresGeneral = [];
                        var indiceControleRequete = listeCriteres.length;
                        //pour chaque groupe, recuperer les informations detaillees du groupe (nom et id)
                        listeCriteres.forEach(function (valeur, indice) {
                            NotesCriteresGroupe.find({"groupes": idGroupe, "criteres": listeCriteres[indice]._id}, function (err, listeNotesCriteres) {
                                listeNotesCriteresGeneral[indice] = listeNotesCriteres;
                                indiceControleRequete--;
                                //attendre qu'on ai bien tout recupere pour sortir de la boucle avec les donnees
                                if (indiceControleRequete == 0) {
                                    callbackRequete();
                                }

                            });
                        });
                        function callbackRequete() {
                            console.log(listeNotesCriteresGeneral);

                            res.render('consultacriteriosalumno.twig', {
                                user: req.user,
                                objGroupe: objGroupe,
                                objEvaluation: objEvaluation,
                                objGroupeEvalue: objGroupeEvalue,
                                listeCriteres: listeCriteres,
                                listeNotesCriteresGeneral: listeNotesCriteresGeneral
                            });

                        }



                    });



                });
            });
        });

    });


    app.get('/eval', isLoggedIn, function (req, res) {

        //verificacion si es un alumno. Si no, error
        if (req.user.local.type_user != "EVAL") {
            res.status(403).json("El usuario no es un EVAL. Prohibido !");
        }

        var mongoose = require('mongoose');
        var Groupe = mongoose.model('Groupe');
        var Evaluation = mongoose.model('Evaluation');
        var GroupeEvalue = mongoose.model('GroupeEvalue');
        //recuperer tous les groupes de l'utilisateur EVAL auquel il est assigne
        Groupe.find({"userEvaluateurEnCharge": req.user._id}, function (err, listeGroupe) {
            console.log("LISTING DES GROUPES DE L USER EVAL");
            console.log(listeGroupe);

            if (err) {
                throw err;
            }


            var listeEvaluationParGroupeGeneral = [];
            var indiceControleRequete = listeGroupe.length;
            //pour chaque groupe, recuperer les evaluations associees
            listeGroupe.forEach(function (valeur, indice) {
                GroupeEvalue.find({"groupes": listeGroupe[indice]._id}, function (err, listeEvaluationParGroupe) {
                    listeEvaluationParGroupeGeneral[indice] = listeEvaluationParGroupe;
                    indiceControleRequete--;
                    //attendre qu'on ai bien tout recupere pour sortir de la boucle avec les donnees
                    if (indiceControleRequete == 0) {
                        callbackRequete();
                    }

                });
            });

            function callbackRequete() {
                console.log("LISTE DES EVALUATIONS PAR GROUPE");
                console.log(listeEvaluationParGroupeGeneral);

                //recuperer le detail de l evaluation (nom, date, type...)
                //pour avoir le nombre d evals total qu il y a dans toutes les cases du tableau
                var indiceControleRequeteDetailEvaluation = 0;
                var listeOrdonneeEval = [];
                for (var indiceControleGroupe = 0; indiceControleGroupe < listeEvaluationParGroupeGeneral.length; indiceControleGroupe++) {
                    for (var indiceControleEval = 0; indiceControleEval < listeEvaluationParGroupeGeneral[indiceControleGroupe].length; indiceControleEval++) {

                        listeOrdonneeEval[indiceControleRequeteDetailEvaluation] = listeEvaluationParGroupeGeneral[indiceControleGroupe][indiceControleEval].evaluations;
                        indiceControleRequeteDetailEvaluation++;
                    }
                }

                console.log("CONTENU DE LA LISTE ");
                console.log(listeOrdonneeEval);

                listeDetailEvalGeneral = [];

                listeOrdonneeEval.forEach(function (valeur, indice) {
                    Evaluation.find({"_id": listeOrdonneeEval[indice]}, function (err, listeDetailEval) {


                        //console.log(listeEvalsParGroupe);
                        listeDetailEvalGeneral[indice] = listeDetailEval;
                        indiceControleRequeteDetailEvaluation--;
                        //attendre qu'on ai bien tout recupere pour sortir de la boucle avec les donnees
                        if (indiceControleRequeteDetailEvaluation == 0) {
                            callbackRequeteRender();
                        }

                    });
                });

                function callbackRequeteRender() {
                    console.log("QUEL EST L ORDRE DE LA LISTE ?");
                    console.log(listeDetailEvalGeneral);

                    res.render('eval.twig', {
                        user: req.user, // get the user out of session and pass to template
                        listeGroupe: listeGroupe,
                        listeEvaluationParGroupeGeneral: listeEvaluationParGroupeGeneral,
                        listeDetailEvalGeneral: listeDetailEvalGeneral

                    });
                }
            }
        });
    });



    app.get('/modificarevaluacion', isLoggedIn, function (req, res) {

        //verificacion si es un alumno. Si no, error 
        if (req.user.local.type_user != "EVAL") {
            res.status(403).json("El usuario no es un EVAL. Prohibido !");
        }

        var mongoose = require('mongoose');
        var idEvaluation = req.param("idEvaluation");
        var idGroupe = req.param("idGroupe");
        console.log(idEvaluation);
        console.log(idGroupe);

        var mongoose = require('mongoose');
        var Groupe = mongoose.model('Groupe');
        var Evaluation = mongoose.model('Evaluation');
        var GroupeEvalue = mongoose.model('GroupeEvalue');
        var CriteresEvaluation = mongoose.model('CriteresEvaluation');
        var NotesCriteresGroupe = mongoose.model('NotesCriteresGroupe');


        //recuperer les infos du groupe
        Groupe.find({"_id": idGroupe}, function (err, objGroupe) {
            if (err) {
                throw err;
            }
            console.log(objGroupe);

            //verification que l'id de l evaluateur en cours correspond 
            //à celui qui a été assigné au groupe 
            if(objGroupe[0].userEvaluateurEnCharge != req.user._id) {
                
                throw "El usuario EVAL no corresponde con el usuario asignado a la comision. Prohibido !";
            }

            //recuperer les infos de l evaluation
            Evaluation.find({"_id": idEvaluation}, function (err, objEvaluation) {
                console.log(objEvaluation);

                //recuperer les infos du groupe evalue
                GroupeEvalue.find({"groupes": idGroupe, "evaluations": idEvaluation}, function (err, objGroupeEvalue) {
                    console.log(objGroupeEvalue);

                    //recuperer les criteres d evaluation de l evaluation
                    CriteresEvaluation.find({"evaluation": idEvaluation}, function (err, listeCriteres) {
                        console.log(listeCriteres);

                        //comms est un tableau de hash
                        var listeNotesCriteresGeneral = [];
                        var nbCriteres = listeCriteres.length;
                        var indiceControleRequete = listeCriteres.length;
                        //pour chaque groupe, recuperer les informations detaillees du groupe (nom et id)
                        listeCriteres.forEach(function (valeur, indice) {
                            NotesCriteresGroupe.find({"groupes": idGroupe, "criteres": listeCriteres[indice]._id}, function (err, listeNotesCriteres) {
                                listeNotesCriteresGeneral[indice] = listeNotesCriteres;
                                indiceControleRequete--;
                                //attendre qu'on ai bien tout recupere pour sortir de la boucle avec les donnees
                                if (indiceControleRequete == 0) {
                                    callbackRequete();
                                }

                            });
                        });
                        function callbackRequete() {
                            console.log(listeNotesCriteresGeneral);

                            res.render('modificarevaluacion.twig', {
                                user: req.user,
                                objGroupe: objGroupe,
                                objEvaluation: objEvaluation,
                                objGroupeEvalue: objGroupeEvalue,
                                listeCriteres: listeCriteres,
                                listeNotesCriteresGeneral: listeNotesCriteresGeneral,
                                idEvaluation: idEvaluation,
                                idGroupe: idGroupe,
                                nbCriteres: nbCriteres

                            });

                        }



                    });



                });
            });
        });

    });

    // route para menejar los estilos por el usario
    app.get('/cambiarEvaluacionGlobal', isLoggedIn, function (req, res) {
        var mongoose = require('mongoose');
        var idEvaluation = req.param("idEvaluation");
        var idGroupe = req.param("idGroupe");
        var noteGlobaleEvaluation = req.param("noteGlobaleEvaluation");
        var commentaireGlobalEvaluation = req.param("commentaireGlobalEvaluation");

        if (noteGlobaleEvaluation < 0 || noteGlobaleEvaluation > 5) {
            throw "el valor de la nota esta incorrecta !!";
        }

//        console.log(idEvaluation);
//        console.log(idGroupe);
//        console.log(noteGlobaleEvaluation);
//        console.log(commentaireGlobalEvaluation);

        var GroupeEvalue = mongoose.model('GroupeEvalue');
        var CriteresEvaluation = mongoose.model('CriteresEvaluation');
        var NotesCriteresGroupe = mongoose.model('NotesCriteresGroupe');


        GroupeEvalue.findOne({"groupes": idGroupe, "evaluations": idEvaluation}, function (err, object) {

            object.noteGlobale = noteGlobaleEvaluation;
            object.commentaire = commentaireGlobalEvaluation;
            object.save();

            CriteresEvaluation.find({"evaluation": idEvaluation}, function (err, objectCriteres) {
                indiceControleRequete = objectCriteres.length;
                objectCriteres.forEach(function (valeur, indice) {
                    NotesCriteresGroupe.findOne({"groupes": idGroupe, "criteres": objectCriteres[indice]._id}, function (err, objectNoteCritere) {
                        objectNoteCritere.noteCritere = noteGlobaleEvaluation;
                        objectNoteCritere.save();

                        indiceControleRequete--;
                        //attendre qu'on ai bien tout recupere pour sortir de la boucle avec les donnees
                        if (indiceControleRequete == 0) {
                            callbackRequeteRender();
                        }
                    });

                });

            });

        });


        function callbackRequeteRender() {
            res.json(idEvaluation);
        }
    });



// route para menejar los estilos por el usario
    app.post('/cambiarCriteriosEvaluacion', isLoggedIn, function (req, res) {

        var mongoose = require('mongoose');
        var NotesCriteresGroupe = mongoose.model('NotesCriteresGroupe');
        var nbCriteres = req.param('nbCriteres', null);
        var idGroupe = req.param('idGroupe', null);
        var idEvaluation = req.param('idEvaluation', null);

        var indiceControleRequete = nbCriteres;

        //check noteCriteres bien dans la gamme de notes
        var noteCritereVerificationIntervale = 0;
        //valeur moyenne a calculer pour la mettre sur l eval global
        var valeurMoyenneCriteres = 0;
        for (var i = 0; i < nbCriteres; i++) {
            noteCritereVerificationIntervale = parseInt(req.param('noteCritere_' + i, null));
            if (noteCritereVerificationIntervale < 0 || noteCritereVerificationIntervale > 5) {
                throw "el valor de la nota esta incorrecta !!";
            }
            valeurMoyenneCriteres = valeurMoyenneCriteres + noteCritereVerificationIntervale;
        }

        valeurMoyenneCriteres = (valeurMoyenneCriteres / nbCriteres).toFixed(2);
        //console.log("VALEUR MOYENNE DES CRITERES = " + valeurMoyenneCriteres);

        var idCritere = [];
        var commentaireCritere = [];
        var noteCritere = [];
        for (var i = 0; i < nbCriteres; i++) {
            idCritere[i] = req.param('idCritere_' + i, null);
            commentaireCritere[i] = req.param('commentaireCritere_' + i, null);
            noteCritere[i] = req.param('noteCritere_' + i, null);
        }

        //boucle sur tous les criteres
        idCritere.forEach(function (valeur, indice) {
            //assignation des donnees a notes criteres
            NotesCriteresGroupe.findOne({"groupes": idGroupe, "criteres": idCritere[indice]}, function (err, objectNoteCritere) {

                objectNoteCritere.noteCritere = noteCritere[indice];
                objectNoteCritere.commentaire = commentaireCritere[indice];
                objectNoteCritere.save();

                indiceControleRequete--;
                //attendre qu'on ai bien tout recupere pour sortir de la boucle avec les donnees
                if (indiceControleRequete == 0) {
                    callbackRequete();
                }
            });
        });

        function callbackRequete() {

            var GroupeEvalue = mongoose.model('GroupeEvalue');
            GroupeEvalue.findOne({"groupes": idGroupe, "evaluations": idEvaluation}, function (err, objectGroupeEvalue) {

                objectGroupeEvalue.noteGlobale = valeurMoyenneCriteres;
                objectGroupeEvalue.save();

                callbackRequeteRender();
            });
        }

        function callbackRequeteRender() {
            res.json(idEvaluation);
        }

    });

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect: '/profile',
                failureRedirect: '/'
            }));
};
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}

require('./models/user');
require('./models/base_donnees');
