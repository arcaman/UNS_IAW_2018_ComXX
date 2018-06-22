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
