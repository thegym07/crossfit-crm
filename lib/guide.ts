// Contenu du Guide CRM (onglet « Guide CRM »), vérifié dans le code le 06/11/2026 (tarifs ajoutés le même jour).
// À mettre à jour à chaque changement visible du CRM.

/** Clé locale : le guide a déjà été ouvert sur cet appareil (sinon, la 1re connexion y mène). */
export const GUIDE_VU = 'guide-crm-vu'

type Section = { titre: string; icone: string; intro: string; etapes: string[]; astuce?: string | null }
type Guide = { accroche: string; routine: string[]; sections: Section[]; faq: { q: string; r: string }[] }

export const GUIDE: Guide = {
  "accroche": "Ce CRM t'aide à rappeler vite chaque personne qui veut essayer La Salle CrossFit. Ton but : la joindre, lui faire réserver sa séance d'essai offerte, puis la suivre jusqu'à l'inscription.",
  "routine": [
    "Ouvre le « Dashboard ». Regarde « 📅 RDV du jour » et « 😴 Prospects qui dorment » (personne ne les a contactés depuis plus de 48 h). Ne compte pas sur une alerte quand un prospect arrive : ouvre le CRM plusieurs fois par jour.",
    "Va dans « Prospects » et appelle ceux du haut de la liste : ce sont ceux à appeler aujourd'hui, les plus récents en premier. Après chaque appel, clique « 📞 Pas répondu » ou « ✓ A répondu ».",
    "Après un « Pas répondu », clique « 💬 Envoyer le SMS » : le message est déjà écrit, tu n'as plus qu'à l'envoyer.",
    "Va dans « RDV & Relances » (sur téléphone : « RDV »). Envoie le SMS « 💬 Confirmer » ou « 💬 Rappel » aux RDV à venir. Pour chaque RDV passé, remplis la présence puis le résultat.",
    "Plus bas dans le même onglet, traite les « 🔁 Relances » (« À rappeler » puis « Post-séance ») : appelle, puis clique « 📞 Relancé ».",
    "En fin de journée, ouvre « Rapport ». Vérifie les chiffres, écris le nombre de « RDV pris » et coche « 📱 SMS de relance envoyés ? » (à faire avant 18h)."
  ],
  "sections": [
    {
      "titre": "Dashboard",
      "icone": "📊",
      "intro": "Ta page d'accueil : ce que tu dois faire aujourd'hui, et tes chiffres.",
      "etapes": [
        "En haut, choisis la période des chiffres : « Tout », « 90 jours », « Mois en cours » ou un mois précis.",
        "Les 4 cases comptent les prospects ajoutés sur cette période, selon où ils en sont aujourd'hui : « Total prospects », « Nouveaux prospects », « Vendus », « À relancer ».",
        "« 📅 RDV du jour » : les séances d'essai prévues aujourd'hui, avec l'heure. Touche 📞 pour appeler. « Voir tout → » t'emmène dans « RDV & Relances ».",
        "« 😴 Prospects qui dorment » : des prospects « Nouveau prospect » ou « Contacté sans réponse » que personne n'a appelés ni contactés par SMS depuis plus de 48 h. Le CRM t'en montre 5, les plus anciens en premier (« + … autres » pour la suite). Touche « 📞 Appeler ».",
        "Les prospects dont le rappel est prévu un autre jour ne sont pas comptés comme en retard.",
        "Touche un nom pour ouvrir sa fiche."
      ],
      "astuce": "Ton objectif chaque jour : « Personne ne dort — tout le monde a été rappelé 🎉 ». Chaque prospect coûte de la pub : ne le laisse pas refroidir."
    },
    {
      "titre": "Prospects",
      "icone": "👥",
      "intro": "Les personnes que tu n'as pas encore eues au téléphone : c'est ici que tu passes tes appels.",
      "etapes": [
        "Tu y vois les statuts « Nouveau prospect » et « Contacté sans réponse ». Les filtres en haut : « Tous », « Nouveau prospect », « Contacté sans réponse », « Perdus ». La barre « Rechercher par nom ou téléphone… » trouve une personne.",
        "Touche le numéro pour appeler (⎘ le copie). Le badge « 😴 +48 h » montre ceux qui attendent depuis trop longtemps. Le badge « Rappel le … » montre ceux à rappeler un autre jour : ils sont en bas de la liste.",
        "Personne n'a décroché ? Clique « 📞 Pas répondu ». Un « Nouveau prospect » passe en « Contacté sans réponse », et le CRM prévoit lui-même le prochain appel : 1 jour, puis 1 jour, 2 jours, 3 jours, 7 jours plus tard. Clique ensuite « 💬 Envoyer le SMS ».",
        "Au 6e appel sans réponse, le CRM te dit de classer la personne en « Perdu », motif « Injoignable ».",
        "Tu as eu la personne ? Clique « ✓ A répondu », puis choisis la suite dans le menu du statut. « RDV pris → » ou « À rappeler → » l'envoient dans l'onglet « RDV & Relances ». Après « RDV pris → », la personne est dans « ⚠ Sans date fixée » : ajoute la date. Pas intéressée ? Clique « Perdu ».",
        "« Perdu » ouvre le menu « Motif ? » : « Pas intéressé », « Injoignable », « Trop loin », « Prix », « Inscrit ailleurs » ou « Autre ». La personne sort de la liste mais reste dans le filtre « Perdus ».",
        "Le bouton « 💬 SMS » apparaît après le premier appel. Le bouton « 📝 » ouvre tes notes (touche « Enregistrer »). Sur grand écran, la case « Notes… » s'enregistre seule. « ⬇ Export » télécharge tous les prospects dans un fichier qui s'ouvre avec Excel."
      ],
      "astuce": "Appelle d'abord les prospects les plus récents : c'est maintenant qu'ils ont envie de venir."
    },
    {
      "titre": "RDV & Relances",
      "icone": "📅",
      "intro": "En haut, les séances d'essai réservées. En bas, les personnes à recontacter. Sur téléphone, l'onglet s'appelle « RDV ».",
      "etapes": [
        "« 📅 Rendez-vous » regroupe les « RDV pris » en trois blocs : « ⚠ RDV passés — à mettre à jour (présence ? résultat ?) », « ⚠ Sans date fixée » et « À venir ». La barre de recherche marche pour tout l'onglet.",
        "Pas encore de date ? Touche « 📅 Ajouter la date » (le bouton clignote) : écris le jour, choisis le mois et l'heure (de 9h à 21h, par quart d'heure), puis ✓. Pour changer une date, touche-la.",
        "Envoie le SMS proposé à côté du numéro : « 💬 Rappel » pour un RDV aujourd'hui ou demain, « 💬 Confirmer » pour un RDV plus tard.",
        "Après la séance, remplis la présence : « Oui ✓ » ou « Non » (sur téléphone : « Présent ✓ » ou « Absent »). Un absent part dans les relances « Post-séance » avec le badge « No-show ».",
        "Si la personne était là, choisis le résultat : « Vente ✓ » (choisis ensuite la formule dans le menu « Formule ? » : carte 10 séances, 2 séances/sem ou illimité, avec ou sans engagement 12 mois), « À rappeler → » (elle part en « Post-séance ») ou « Refus » (elle sort de la liste).",
        "« 🔁 Relances » a deux sous-onglets. « À rappeler » : jamais venus en salle, pas encore de RDV. « Post-séance » : déjà venus, ou absents à leur RDV. En haut : ceux jamais contactés (« Jamais » en rouge), puis ceux contactés il y a le plus longtemps.",
        "Appelle, puis clique « 📞 Relancé ». Le bouton « 💬 SMS » propose le bon message (après la séance, après une absence, ou simple relance). Le menu de suivi : « À appeler », « Pas de réponse », « RDV repris → » (la personne retourne dans « Rendez-vous », en « ⚠ Sans date fixée » : ajoute la date) ou « Pas intéressé ✕ » (elle passe en « Perdu » après ta confirmation). Le bouton « Perdu » marche aussi ici."
      ],
      "astuce": "Un RDV passé ne disparaît jamais tout seul : tant que tu n'as pas rempli la présence et le résultat, il reste dans « ⚠ RDV passés »."
    },
    {
      "titre": "Fiche prospect et « + Nouveau »",
      "icone": "📝",
      "intro": "Touche le nom d'une personne pour tout voir. Utilise « + Nouveau » pour ajouter quelqu'un à la main.",
      "etapes": [
        "La fiche montre « Contact » (téléphone, e-mail, source), « Suivi des appels », « Rendez-vous », « Vente » et, s'il y en a, tes « Notes ». « ← Prospects » te ramène à la liste.",
        "Dans « Suivi des appels », tu as les mêmes boutons « 📞 Pas répondu » et « ✓ A répondu » que dans la liste (mais pas le bouton SMS).",
        "« Modifier » permet de corriger le prénom, le nom, le téléphone, l'adresse mail, l'activité ou la date du RDV, puis « Sauvegarder ».",
        "Pour ajouter quelqu'un (passage à la salle, bouche-à-oreille…), clique « + Nouveau » dans « Prospects » ou « RDV & Relances ». Remplis « Prénom », « Nom », « Téléphone », « Adresse mail », « Activité » (WOD (CrossFit), Hyrox, ATHX). Le prénom ou le nom est obligatoire. La source sera « Autre » : note d'où vient la personne avec 📝.",
        "Remplis « Date et heure du RDV » si la séance est déjà fixée : en cliquant « Créer le prospect », la personne arrive directement dans « RDV & Relances ». Sans date, elle arrive dans « Prospects » en « Nouveau prospect ».",
        "Sur la fiche, tu trouves aussi « Perdu » ou, pour un perdu, « ↩ Remettre en prospect »."
      ],
      "astuce": "Le bouton « Effacer (demande RGPD) » supprime la fiche pour toujours. Ne l'utilise que si la personne demande l'effacement de ses données."
    },
    {
      "titre": "Rapport",
      "icone": "📋",
      "intro": "Le bilan de ta journée, en moins d'une minute.",
      "etapes": [
        "Le « Rapport journalier » s'ouvre sur aujourd'hui. Les flèches ← et → changent de jour.",
        "Le CRM compte tes clics du jour : « Appels passés » = « Pas répondu » + « A répondu » + « Relancé ». « Personnes au tél » = tes « A répondu ». Tes SMS sont comptés à part, dans la ligne grise sous le rapport.",
        "La première fois que tu ouvres le rapport du jour, ces chiffres sont remplis tout seuls. Ensuite, ils ne bougent plus seuls : si tu as passé d'autres appels, clique « ↻ Reprendre les chiffres du CRM ».",
        "Écris à la main le nombre de « RDV pris ».",
        "Coche « 📱 SMS de relance envoyés ? » quand c'est fait : « À faire avant 18h ».",
        "Tout s'enregistre seul : tu vois « ✓ Enregistré automatiquement à … ». Tu peux corriger toute la journée.",
        "En bas : le « Bilan mensuel » (totaux et moyenne par jour) et l'« Historique » des derniers jours."
      ],
      "astuce": "Tu vois « ⚠ Pas enregistré (connexion ?) » ? Vérifie ta connexion, puis modifie un chiffre pour réessayer."
    },
    {
      "titre": "Commission Bonus",
      "icone": "💶",
      "intro": "Ton bonus : 10 € par RDV où le prospect était présent, qu'il achète ou non.",
      "etapes": [
        "La commission se crée toute seule quand tu mets la présence sur « Oui ✓ » (ou « Présent ✓ ») dans « RDV & Relances ». Une seule par personne et par jour de RDV.",
        "En haut, le total du mois en cours et le nombre de « RDV présents ». Une commission compte dans le mois du RDV.",
        "Chaque ligne montre la personne, la date du RDV et où elle en est aujourd'hui : par exemple « En cours », « Vendu », « Refus », « À relancer » ou « Perdu ». « Supprimé du CRM » si la fiche a été effacée.",
        "Une commission par erreur ? La croix ✕ la retire, après confirmation.",
        "« Historique » : le total de chaque mois passé. Touche « (détail) » pour voir les noms."
      ],
      "astuce": "Les commissions sont figées : changer une fiche ensuite (même remettre la présence « En attente ») ne les retire pas. Seule la croix ✕ les supprime."
    },
    {
      "titre": "Rentabilité",
      "icone": "📈",
      "intro": "Pour voir si les pubs et les rappels rapportent plus qu'ils ne coûtent.",
      "etapes": [
        "Le gros chiffre = revenus du mois moins les dépenses : pub (10 € par jour, jusqu'à aujourd'hui pour le mois en cours), salaire (150 € par mois) et commissions bonus.",
        "Les revenus viennent des ventes et de leur formule : carte 10 séances 130 €, 2 séances/sem 80 €/mois ou illimité 100 €/mois sans engagement, 2 séances/sem 65 €/mois ou illimité 85 €/mois avec engagement 12 mois (compté chaque mois pendant 12 mois). Une vente sans formule apparaît dans le bandeau jaune « vente sans formule » : choisis-la pour compter le revenu.",
        "« RDV pointés » : la part des RDV où la personne est venue. « Taux de vente » : la part des personnes venues qui ont acheté.",
        "« Mois par mois » : touche un mois pour l'afficher en grand, puis « ← Revenir au mois en cours »."
      ],
      "astuce": "Pour faire monter ces chiffres : confirme chaque RDV par SMS et envoie le « Rappel » la veille ou le jour même."
    },
    {
      "titre": "Réglages",
      "icone": "⚙️",
      "intro": "Les réglages des e-mails d'alerte, gérés par le responsable de la box.",
      "etapes": [
        "Cet onglet sert seulement aux e-mails d'alerte (« 📩 E-mail à chaque nouveau prospect »). Tu n'en as pas besoin pour rappeler tes prospects.",
        "Pour l'instant, ne compte pas sur un e-mail pour savoir qu'un prospect est arrivé : regarde le CRM.",
        "Ne change rien ici sans en parler au responsable de la box.",
        "Pour quitter le CRM, clique « 🚪 Déconnexion » en bas du menu (sur téléphone : dans « ⋯ Plus »)."
      ]
    }
  ],
  "faq": [
    {
      "q": "D'où viennent les prospects ?",
      "r": "Ceux des pubs Meta arrivent tout seuls dans « Prospects », en « Nouveau prospect », avec la source « Meta Ads ». L'origine de la pub et les réponses au formulaire sont dans les notes. Ceux du formulaire d'inscription en ligne arrivent aussi tout seuls (source « Formulaire web »). Les autres, tu les ajoutes avec « + Nouveau » (source « Autre »). Ne compte pas sur une alerte : ouvre le CRM souvent."
    },
    {
      "q": "Un prospect apparaît en double ?",
      "r": "Si quelqu'un remplit encore la pub Meta avec le même téléphone ou le même e-mail, le CRM ne crée pas de deuxième fiche. Il ajoute la note « ↩ Redemande une séance par la pub le … ». S'il était « Perdu » ou en « Refus », il redevient « Nouveau prospect » et repasse dans les prospects à appeler aujourd'hui. Avec « + Nouveau » ou le formulaire en ligne, le CRM ne vérifie rien : cherche d'abord le nom ou le numéro avec la recherche."
    },
    {
      "q": "Comment supprimer un prospect ?",
      "r": "On ne supprime pas : clique « Perdu » et choisis le motif. La personne sort de ta liste, mais elle reste dans « Prospects » > « Perdus » avec son historique. « Effacer (demande RGPD) », sur la fiche, sert seulement si la personne demande l'effacement de ses données. C'est définitif."
    },
    {
      "q": "J'ai cliqué sur le mauvais bouton, comment annuler ?",
      "r": "Mauvais « Pas répondu » ou « A répondu » : touche tout de suite le compteur (par exemple « 2 appels »), puis « Annuler le dernier ». Si tu le fais juste après le clic, le statut et la date de rappel reviennent aussi comme avant ; plus tard, seul l'appel est retiré. Mauvais « 📞 Relancé » : ouvre la fiche, touche le compteur dans « Suivi des appels », puis « Annuler le dernier ». Menu « Perdu » ouvert par erreur : choisis « ← Annuler ». Prospect mis en « Perdu » par erreur : « Perdus » puis « ↩ Remettre en prospect » (il revient en « Nouveau prospect »). Présence « Non » par erreur : dans « Post-séance », choisis « RDV repris → » et remets la date. Commission en trop : la croix ✕ dans « Commission Bonus »."
    },
    {
      "q": "Que faire après 6 appels sans réponse ?",
      "r": "Le CRM affiche « 6 sans réponse : à classer « Perdu » ». Clique « Perdu » et choisis le motif « Injoignable ». Rien n'est effacé : si la personne redemande une séance par la pub, elle revient toute seule dans ta liste."
    },
    {
      "q": "Un prospect « Perdu » me rappelle, je fais quoi ?",
      "r": "Va dans « Prospects », filtre « Perdus », puis clique « ↩ Remettre en prospect ». Il redevient « Nouveau prospect » et la série de rappels repart de zéro (son historique d'appels est gardé)."
    },
    {
      "q": "Le SMS part-il tout seul ?",
      "r": "Non. Le bouton ouvre l'appli Messages de ton téléphone avec le texte déjà écrit : tu n'as qu'à appuyer sur envoyer. Le SMS part de ton téléphone. Le CRM le note dans l'historique du prospect dès que tu touches le bouton."
    },
    {
      "q": "Un RDV est passé et je n'ai rien rempli ?",
      "r": "Il reste en haut de « RDV & Relances », dans « ⚠ RDV passés — à mettre à jour ». Remplis la présence, puis le résultat. Tant que ce n'est pas fait, il ne disparaît pas."
    },
    {
      "q": "Sur téléphone, je ne trouve pas un onglet ?",
      "r": "En bas de l'écran, tu as « Dashboard », « Prospects », « RDV », « Guide » et « ⋯ Plus ». « Rapport », « Commission Bonus », « Rentabilité », « Réglages » et « Déconnexion » sont dans « ⋯ Plus »."
    }
  ]
}
