import {Response} from "express";
import {RequestWithOcr} from "@/types";
import {spawn} from 'child_process'
import fs from 'fs'

export const handleOcr = async (req: RequestWithOcr, res: Response) => {
    try {
        const images = req.images?.images || [];

        if (images.length === 0) {
            return res.status(400).json({ error: 'No images found' });
        }

        let cleanedResult: any[] = [];

        const processImage = (image: string) => {
            return new Promise((resolve, reject) => {
                let result = '';

                const pythonProcess = spawn('python', ['src/python/ocr.py', image]);

                pythonProcess.stdout.on('data', (data) => {
                    result += data.toString();
                });

                pythonProcess.stderr.on('data', (data) => {
                    console.error(`Error: ${data}`);
                });

                pythonProcess.on('close', (code) => {
                    if (code === 0) {
                        const extractedText = result
                            .replace(/[\r\n"\[\]']/g, '')
                            .split(',')
                            .map(item => item.trim());

                        cleanedResult = [
                            ...cleanedResult,
                            ...extractedText
                        ];

                        fs.unlinkSync(image);

                        resolve(extractedText);
                    } else {
                        reject('Failed to process image');
                    }
                });
            });
        };

        await Promise.all(images.map(processImage));

        return res.json(processExtractedText(cleanedResult, req.step));
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const handleSa1 = (texts: string[]) => {

    const data = {
        nom_du_site: "",
        code_site: "",
        ville: "",
        wilaya: "",
        longitude: "",
        latitude: "",
        band_bts: "",
        configuration_bts: "",
        secteur_1: { azimuth: "", inclinaison: "", hauteur_antenne: "" },
        secteur_2: { azimuth: "", inclinaison: "", hauteur_antenne: "" },
        secteur_3: { azimuth: "", inclinaison: "", hauteur_antenne: "" },
        rayon_recherche: "",
        echelle: "",
        informations_additionnelles: "",
        responsable_rf_ingenieur: "",
        signature_ingenieur: "",
        date_ingenieur: "",
        responsable_rf_manager: "",
        signature_manager: "",
        date_manager: "",
        candidat_x: { long: "", lat: "", addr: "" },
        candidat_y: { long: "", lat: "", addr: "" },
        candidat_z: { long: "", lat: "", addr: "" },
    };

    for (let i = 0; i < texts.length; i++) {
        const text = texts[i].toLowerCase().trim();
        const nextText = texts[i + 1]?.trim() || '';

        if (text.includes("nom du site")) data.nom_du_site = nextText;
        else if (text.includes("code site")) data.code_site = nextText;
        else if (text.includes("ville")) data.ville = nextText;
        else if (text.includes("wilaya")) data.wilaya = nextText;
        else if (text.includes("longitude")) data.longitude = nextText;
        else if (text.includes("latitude")) data.latitude = nextText;
        else if (text.includes("band de bts")) data.band_bts = nextText;
        else if (text.includes("configuration bts")) data.configuration_bts = nextText;
        else if (text.includes("rayon max de recherche")) data.rayon_recherche = nextText;
        else if (text.includes("echelle")) data.echelle = nextText;
        else if (text.includes("informations additionnelles")) data.informations_additionnelles = nextText;

        else if (text.includes("secteur") && nextText.includes("azimuth")) {
            data.secteur_1.azimuth = texts[i + 2]?.trim() || '';
            data.secteur_2.azimuth = texts[i + 3]?.trim() || '';
            data.secteur_3.azimuth = texts[i + 4]?.trim() || '';
        }
        else if (text.includes("inclinasison")) {
            data.secteur_1.inclinaison = nextText;
            data.secteur_2.inclinaison = texts[i + 2]?.trim() || '';
            data.secteur_3.inclinaison = texts[i + 3]?.trim() || '';
        }
        else if (text.includes("hauteur d antenne")) {
            data.secteur_1.hauteur_antenne = nextText;
            data.secteur_2.hauteur_antenne = texts[i + 2]?.trim() || '';
            data.secteur_3.hauteur_antenne = texts[i + 3]?.trim() || '';
        }
    }

    return data
}

const handleSa2 = (texts: string[]) => {

    const data = {
        nom_du_site: "",
        code_site: "",
        qualite_radio: "",
        candidat: "",
        phase: "",
        nom_negociateur: "",
        mobile_negociateur: "",
        societe_negociateur: "",
        telephone_negociateur: "",
        adresse_site: "",
        commune: "",
        wilaya: "",
        nom_proprietaire: "",
        telephone_proprietaire: "",
        adresse_proprietaire: "",
        mobile_proprietaire: "",
        fax_proprietaire: "",
        personne_a_contacter: "",
        telephone_contact: "",
        adresse_contact: "",
        mobile_contact: "",
        fax_contact: "",
        autres_informations: "",
        type_de_site: "",
        hauteur: "",
        nombre_etage: "",
        annee_construction: "",
        toit_plat: "",
        local_disponible: "",
        dimensions_local: "",
        longitude_site_theorique: "",
        longitude_candidat: "",
        latitude_candidat: "",
        source_coordonnees: "",
        altitude: "",
        zone: "",
        environnement: "",
        antennes_sur_site: "",
        autres_sites_environnants: "",
        type_propriete: "",
        acces_24_24: "",
        date_estimee_signature: "",
        fiabilite_negociation: "",
        diag_obstacles: "",
        panoramique: "",
        croquis_sommaire: "",
        photo_local: "",
        carte: "",
        photo_terasse: "",
        photo_ensemble: "",
        autres: "",
        acq_validated: "",
        acq_rejected: "",
        acq_gele: "",
        responsable_acq: "",
        data_validation_acq: "",
        rad_validated: "",
        rad_rejected: "",
        rad_gele: "",
        responsable_RF: "",
        date_validation_RF: "",
        negociateur_soustraitant: "",
        date_negociateur_soustraitant: ""
    };

    for (let i = 0; i < texts.length; i++) {
        const text = texts[i].toLowerCase().trim();
        const nextText = texts[i + 1]?.trim() || '';

        if (text.includes("nom du site")) data.nom_du_site = nextText;
        else if (text.includes("code site")) data.code_site = nextText;
        else if (text.includes("qualité radio")) data.qualite_radio = nextText;
        else if (text.includes("candidat")) data.candidat = nextText;
        else if (text.includes("phase")) data.phase = nextText;
        else if (text.includes("nom négociateur")) data.nom_negociateur = nextText;
        else if (text.includes("mobile négociateur")) data.mobile_negociateur = nextText;
        else if (text.includes("société négociateur")) data.societe_negociateur = nextText;
        else if (text.includes("téléphone négociateur")) data.telephone_negociateur = nextText;
        else if (text.includes("adresse site")) data.adresse_site = nextText;
        else if (text.includes("commune")) data.commune = nextText;
        else if (text.includes("wilaya")) data.wilaya = nextText;
        else if (text.includes("nom propriétaire")) data.nom_proprietaire = nextText;
        else if (text.includes("téléphone propriétaire")) data.telephone_proprietaire = nextText;
        else if (text.includes("adresse propriétaire")) data.adresse_proprietaire = nextText;
        else if (text.includes("mobile propriétaire")) data.mobile_proprietaire = nextText;
        else if (text.includes("fax propriétaire")) data.fax_proprietaire = nextText;
        else if (text.includes("personne à contacter")) data.personne_a_contacter = nextText;
        else if (text.includes("téléphone contact")) data.telephone_contact = nextText;
        else if (text.includes("adresse contact")) data.adresse_contact = nextText;
        else if (text.includes("mobile contact")) data.mobile_contact = nextText;
        else if (text.includes("fax contact")) data.fax_contact = nextText;
        else if (text.includes("autres informations")) data.autres_informations = nextText;
        else if (text.includes("type de site")) data.type_de_site = nextText;
        else if (text.includes("hauteur")) data.hauteur = nextText;
        else if (text.includes("nombre étage")) data.nombre_etage = nextText;
        else if (text.includes("année construction")) data.annee_construction = nextText;
        else if (text.includes("toit plat")) data.toit_plat = nextText;
        else if (text.includes("local disponible")) data.local_disponible = nextText;
        else if (text.includes("dimensions local")) data.dimensions_local = nextText;
        else if (text.includes("longitude site théorique")) data.longitude_site_theorique = nextText;
        else if (text.includes("longitude candidat")) data.longitude_candidat = nextText;
        else if (text.includes("latitude candidat")) data.latitude_candidat = nextText;
        else if (text.includes("source coordonnées")) data.source_coordonnees = nextText;
        else if (text.includes("altitude")) data.altitude = nextText;
        else if (text.includes("zone")) data.zone = nextText;
        else if (text.includes("environnement")) data.environnement = nextText;
        else if (text.includes("antennes sur site")) data.antennes_sur_site = nextText;
        else if (text.includes("autres sites environnants")) data.autres_sites_environnants = nextText;
        else if (text.includes("type propriété")) data.type_propriete = nextText;
        else if (text.includes("accès 24/24")) data.acces_24_24 = nextText;
        else if (text.includes("date estimée signature")) data.date_estimee_signature = nextText;
        else if (text.includes("fiabilité négociation")) data.fiabilite_negociation = nextText;
        else if (text.includes("diagnostic obstacles")) data.diag_obstacles = nextText;
        else if (text.includes("panoramique")) data.panoramique = nextText;
        else if (text.includes("croquis sommaire")) data.croquis_sommaire = nextText;
        else if (text.includes("photo local")) data.photo_local = nextText;
        else if (text.includes("carte")) data.carte = nextText;
        else if (text.includes("photo terrasse")) data.photo_terasse = nextText;
        else if (text.includes("photo ensemble")) data.photo_ensemble = nextText;
        else if (text.includes("acq validated")) data.acq_validated = nextText;
        else if (text.includes("acq rejected")) data.acq_rejected = nextText;
        else if (text.includes("acq gelé")) data.acq_gele = nextText;
        else if (text.includes("responsable acquisition")) data.responsable_acq = nextText;
        else if (text.includes("date validation acquisition")) data.data_validation_acq = nextText;
        else if (text.includes("rad validated")) data.rad_validated = nextText;
        else if (text.includes("rad rejected")) data.rad_rejected = nextText;
        else if (text.includes("rad gelé")) data.rad_gele = nextText;
        else if (text.includes("responsable RF")) data.responsable_RF = nextText;
        else if (text.includes("date validation RF")) data.date_validation_RF = nextText;
        else if (text.includes("négociateur sous-traitant")) data.negociateur_soustraitant = nextText;
        else if (text.includes("date négociateur sous-traitant")) data.date_negociateur_soustraitant = nextText;
    }

    return data;

}

const handleSa3 = (texts: string[]) => {

    const data = {
        Nom_du_site: "",
        Code_Site: "",
        Qualité_radio: "",
        Candidat: "",
        Nom_Negociateur: "",
        Mobile_Negociateur: "",
        Societe: "",
        Téléphone_Societe: "",
        Adresse_du_site: "",
        Ville: "",
        Wilaya: "",
        Nom_proprietaire: "",
        Téléphone_proprietaire: "",
        Adresse_proprietaire: "",
        Mobile_proprietaire: "",
        Fax_proprietaire: "",
        Personne_contacter: "",
        Personne_contacter_Telephone: "",
        Adresse_contact: "",
        Mobile_contact: "",
        Fax_contact: "",
        Autres_informations: "",
        Type_de_propriete: "",
        Date_estimee_signature: "",
        Fiabilite_negociation: "",
        Longitude_theorique: "",
        Longitude_Candidat: "",
        Latitude_theorique: "",
        Latitude_Candidat: "",
        Reference_carte: "",
        Altitude: "",
        Source_coordonnees: "",
        Zone: "",
        Environnement: "",
        Antennes_presentes_site: "",
        Autres_sites_environnants: "",
        Type_de_site: "",
        Hauteur: "",
        Cas_batiment: "",
        Nombre_etages: "",
        Annee_construction: "",
        Toit_plat: "",
        Local_disponible: "",
        Dimensions_local: "",
        Type_équipement: "",
        Percement_necessaire: "",
        Dimensions_site: "",
        Nombre_mats: "",
        Commentaires_dimensions_structure_equipements: "",
        Commentaires_generaux_construction: "",
        "Plans_As-built_existants": "",
        Commentaires_degats_existants: "",
        Restrictions_construction: "",
        Commentaires_autre_opérateurs_existants: "",
        Acces_24: "",
        Acces_semaine: "",
        Acces_Weekend: "",
        Acces_semaine_pendant: "",
        Acces_Weekend_pendant: "",
        Itineraire_acces_site: "",
        Commentaires_acces_emplacements: "",
        Conditions_entee: "",
        Boite_cles_installer: "",
        Ascenseur: "",
        Dimensions_poids_Ascenseur: "",
        Monte_charges: "",
        Dimensions_poids_Monte_charges: "",
        Droit_passage_demande: "",
        Commentaires_droit_passage: "",
        Nouvelle_route_necessaire: "",
        Longueur_estimee: "",
        Disponible: "",
        Nacelle_necessaire: "",
        Clôture_equipement_existante: "",
        Nouvelle_clôture_necessaire: "",
        Dalles_beton_existantes: "",
        Emplacements_BTS: "",
        Espace_nacelle: "",
        Alimentation_disponible_site: "",
        Nouveau_branchement_necessaire_energie: "",
        Capacite_electrique: "",
        Longueur_cable_alimentation: "",
        Section_cable_alimentation: "",
        Localisation_branchement_principal: "",
        Cheminement_cable_alimentation: "",
        Commentaires_energie: "",
        Mise_a_terre: "",
        Longueur_MAT: "",
        MAT_courant_AC: "",
        Ceinturage_existant: "",
        Barre_principale_MAT: "",
        Descente_terre: "",
        Emplacement_MAT_bâtiment_principal: "",
        Commentaires_descente_terre: "",
        Parafoudre_existant: "",
        Necessaire: "",
        Parafoudre_radioactif: "",
        Parafoudre_radioactif_Commentaires: "",
        Systeme_permanent_necessaire: "",
        Systeme_temporaire_necessaire: "",
        Description_systeme_permanent: "",
        Description_système_temporaire: "",
        Validation_Acquisition: "",
        non_Validation_Acquisition: "",
        gele_Acquisition: "",
        Responsable_Acq: "",
        Signature_Responsable_Acq: "",
        Responsable_Acq_date: "",
        Responsable_Acq_Commentaires: "",
        Validation_Radio: "",
        non_Validation_Radio: "",
        gele_Radio: "",
        Responsable_RF: "",
        Responsable_RF_Signature: "",
        Responsable_RF_date: "",
        Responsable_RF_Commentaires: "",
        Validation_Construction: "",
        non_Validation_Construction: "",
        gele_Construction: "",
        Responsable_CW: "",
        Responsable_CW_Signature: "",
        Responsable_CW_date: "",
        Responsable_CW_Commentaires: "",
        Validation_Transmission: "",
        non_Validation_Transmission: "",
        gele_Transmission: "",
        Responsable_Trans: "",
        Responsable_Trans_Signature: "",
        Responsable_Trans_date: "",
        Responsable_Trans_Commentaires: "",
        Type_BTS: "",
        Configuration_BTS: "",
        Azimut_sec1: "",
        Azimut_sec2: "",
        Azimut_sec3: "",
        Nombre_antennes_sec1: "",
        Nombre_antennes_sec2: "",
        Nombre_antennes_sec3: "",
        HBA_toit_sec1: "",
        HBA_toit_sec2: "",
        HBA_toit_sec3: "",
        HBA_sol_sec1: "",
        HBA_sol_sec2: "",
        HBA_sol_sec3: "",
        Type_antenne_sec1: "",
        Type_antenne_sec2: "",
        Type_antenne_sec3: "",
        TMA_sec1: "",
        TMA_sec2: "",
        TMA_sec3: "",
        Tilt_electrique_sec1: "",
        Tilt_electrique_sec2: "",
        Tilt_electrique_sec3: "",
        Tilt_mecanique_sec1: "",
        Tilt_mecanique_sec2: "",
        Tilt_mecanique_sec3: "",
        Longueur_feeder_sec1: "",
        Longueur_feeder_sec2: "",
        Longueur_feeder_sec3: "",
        Diametre_feeder_sec1: "",
        Diametre_feeder_sec2: "",
        Diametre_feeder_sec3: "",
        Combiner_sec1: "",
        Combiner_sec2: "",
        Combiner_sec3: "",
        Visibilte_hub1_potentiel: "",
        Azimut_hub1_potentiel: "",
        Adresse_hub1_potentiel: "",
        Visibilte_hub2_potentiel: "",
        Azimut_hub2_potentiel: "",
        Adresse_hub2_potentiel: "",
        Visibilte_hub3_potentiel: "",
        Azimut_hub3_potentiel: "",
        Adresse_hub3_potentiel: "",
        Nouveau_support_antenne_necessaire: "",
        LS_disponible_site: "",
        Nouveau_branchement_necessaire_liaison: "",
        Localisation_boitier_raccordement: "",
        Cheminement_LS: "",
        Distance_repartiteur_boitier: "",
        Distance_boitier_BTS: "",
        Type_bts: "",
        Config_bts: ""
    };

    for (let i = 0; i < texts.length; i++) {
        const text = texts[i].toLowerCase().trim(); // تحويل النص إلى أحرف صغيرة للمقارنة
        const nextText = texts[i + 1]?.trim() || '';

        if (text.includes("nom du site")) data.Nom_du_site = nextText;
        else if (text.includes("code site")) data.Code_Site = nextText;
        else if (text.includes("qualité radio")) data.Qualité_radio = nextText;
        else if (text.includes("candidat")) data.Candidat = nextText;
        else if (text.includes("nom negociateur")) data.Nom_Negociateur = nextText;
        else if (text.includes("mobile negociateur")) data.Mobile_Negociateur = nextText;
        else if (text.includes("societe")) data.Societe = nextText;
        else if (text.includes("téléphone societe")) data.Téléphone_Societe = nextText;
        else if (text.includes("adresse du site")) data.Adresse_du_site = nextText;
        else if (text.includes("ville")) data.Ville = nextText;
        else if (text.includes("wilaya")) data.Wilaya = nextText;
        else if (text.includes("nom proprietaire")) data.Nom_proprietaire = nextText;
        else if (text.includes("téléphone proprietaire")) data.Téléphone_proprietaire = nextText;
        else if (text.includes("adresse proprietaire")) data.Adresse_proprietaire = nextText;
        else if (text.includes("mobile proprietaire")) data.Mobile_proprietaire = nextText;
        else if (text.includes("fax proprietaire")) data.Fax_proprietaire = nextText;
        else if (text.includes("personne contacter")) data.Personne_contacter = nextText;
        else if (text.includes("personne contacter téléphone")) data.Personne_contacter_Telephone = nextText;
        else if (text.includes("adresse contact")) data.Adresse_contact = nextText;
        else if (text.includes("mobile contact")) data.Mobile_contact = nextText;
        else if (text.includes("fax contact")) data.Fax_contact = nextText;
        else if (text.includes("autres informations")) data.Autres_informations = nextText;
        else if (text.includes("type de propriete")) data.Type_de_propriete = nextText;
        else if (text.includes("date estimée signature")) data.Date_estimee_signature = nextText;
        else if (text.includes("fiabilité négociation")) data.Fiabilite_negociation = nextText;
        else if (text.includes("longitude théorique")) data.Longitude_theorique = nextText;
        else if (text.includes("longitude candidat")) data.Longitude_Candidat = nextText;
        else if (text.includes("latitude théorique")) data.Latitude_theorique = nextText;
        else if (text.includes("latitude candidat")) data.Latitude_Candidat = nextText;
        else if (text.includes("reference carte")) data.Reference_carte = nextText;
        else if (text.includes("altitude")) data.Altitude = nextText;
        else if (text.includes("source coordonnées")) data.Source_coordonnees = nextText;
        else if (text.includes("zone")) data.Zone = nextText;
        else if (text.includes("environnement")) data.Environnement = nextText;
        else if (text.includes("antennes présentes site")) data.Antennes_presentes_site = nextText;
        else if (text.includes("autres sites environnants")) data.Autres_sites_environnants = nextText;
        else if (text.includes("type de site")) data.Type_de_site = nextText;
        else if (text.includes("hauteur")) data.Hauteur = nextText;
        else if (text.includes("cas bâtiment")) data.Cas_batiment = nextText;
        else if (text.includes("nombre étages")) data.Nombre_etages = nextText;
        else if (text.includes("année construction")) data.Annee_construction = nextText;
        else if (text.includes("toit plat")) data.Toit_plat = nextText;
        else if (text.includes("local disponible")) data.Local_disponible = nextText;
        else if (text.includes("dimensions local")) data.Dimensions_local = nextText;
        else if (text.includes("type équipement")) data.Type_équipement = nextText;
        else if (text.includes("percement nécessaire")) data.Percement_necessaire = nextText;
        else if (text.includes("dimensions site")) data.Dimensions_site = nextText;
        else if (text.includes("nombre mats")) data.Nombre_mats = nextText;
        else if (text.includes("validation acquisition")) data.Validation_Acquisition = nextText;
        else if (text.includes("responsable acq")) data.Responsable_Acq = nextText;
        else if (text.includes("signature responsable acq")) data.Signature_Responsable_Acq = nextText;
        else if (text.includes("responsable rf")) data.Responsable_RF = nextText;
        else if (text.includes("signature responsable rf")) data.Responsable_RF_Signature = nextText;
        else if (text.includes("validation radio")) data.Validation_Radio = nextText;
        else if (text.includes("responsable cw")) data.Responsable_CW = nextText;
        else if (text.includes("signature responsable cw")) data.Responsable_CW_Signature = nextText;
        else if (text.includes("validation transmission")) data.Validation_Transmission = nextText;
        else if (text.includes("responsable trans")) data.Responsable_Trans = nextText;
        else if (text.includes("type bts")) data.Type_BTS = nextText;
        else if (text.includes("configuration bts")) data.Configuration_BTS = nextText;
        else if (text.includes("azimut sec1")) data.Azimut_sec1 = nextText;
        else if (text.includes("azimut sec2")) data.Azimut_sec2 = nextText;
        else if (text.includes("azimut sec3")) data.Azimut_sec3 = nextText;
        else if (text.includes("type antenne sec1")) data.Type_antenne_sec1 = nextText;
        else if (text.includes("type antenne sec2")) data.Type_antenne_sec2 = nextText;
        else if (text.includes("type antenne sec3")) data.Type_antenne_sec3 = nextText;
        else if (text.includes("longueur feeder sec1")) data.Longueur_feeder_sec1 = nextText;
        else if (text.includes("longueur feeder sec2")) data.Longueur_feeder_sec2 = nextText;
        else if (text.includes("longueur feeder sec3")) data.Longueur_feeder_sec3 = nextText;
    }

}

const handleSa4 = (texts: string[]) => {

    const data = {
        nom_du_site: "",
        code_site: "",
        region: "",
        candidat: "",
        nom_de_negociateur: "",
        mobile: "",
        societe: "",
        telephone: "",
        adresse_du_site: "",
        ville: "",
        wilaya: "",
        type_de_propriete: "",
        typologie_de_site: "",
        nom_de_contact: "",
        mobile_generales: "",
        telephone_generales: "",
        fax_generales: "",
        montant_de_loyer_annuel: "",
        superficie_louee: "",
        nom_du_bailleur: "",
        mobile_contractuelles: "",
        adresse_de_bailleur: "",
        telephone_contractuelles: "",
        fax_contractuelles: "",
        loyer: "",
        modification_de_contrat1: "",
        modification_de_contrat2: "",
        date_consignation: "",
        documents11: "",
        documents12: "",
        documents13: "",
        documents14: "",
        documents21: "",
        documents22: "",
        documents23: "",
        documents24: "",
        documents31: "",
        documents32: "",
        documents33: "",
        documents34: "",
        documents41: "",
        documents42: "",
        documents52: "",
        documents53: "",
        documents62: "",
        documents64: "",
        documents73: "",
        documents74: "",
        documents82: "",
        documents83: "",
        documents84: "",
        negociateur: "",
        date_negociateur: "",
        responsable_national_acquisition: "",
        signature_validation: "",
        date_responsable_national_acquisition: "",
        responsable_national_acquisition_hors_grille: "",
        signature_responsable_national_acquisition_hors_grille: "",
        date_responsable_national_acquisition_hors_grille: ""
    };

    for (let i = 0; i < texts.length; i++) {
        const text = texts[i].toLowerCase().trim();
        const nextText = texts[i + 1]?.trim() || '';

        if (text.includes("nom du site")) data.nom_du_site = nextText;
        else if (text.includes("code site")) data.code_site = nextText;
        else if (text.includes("région")) data.region = nextText;
        else if (text.includes("candidat")) data.candidat = nextText;
        else if (text.includes("nom du négociateur")) data.nom_de_negociateur = nextText;
        else if (text.includes("mobile")) data.mobile = nextText;
        else if (text.includes("société")) data.societe = nextText;
        else if (text.includes("téléphone")) data.telephone = nextText;
        else if (text.includes("adresse du site")) data.adresse_du_site = nextText;
        else if (text.includes("ville")) data.ville = nextText;
        else if (text.includes("wilaya")) data.wilaya = nextText;
        else if (text.includes("type de propriété")) data.type_de_propriete = nextText;
        else if (text.includes("typologie de site")) data.typologie_de_site = nextText;
        else if (text.includes("nom du contact")) data.nom_de_contact = nextText;
        else if (text.includes("mobile générales")) data.mobile_generales = nextText;
        else if (text.includes("téléphone générales")) data.telephone_generales = nextText;
        else if (text.includes("fax générales")) data.fax_generales = nextText;
        else if (text.includes("montant loyer annuel")) data.montant_de_loyer_annuel = nextText;
        else if (text.includes("superficie louée")) data.superficie_louee = nextText;
        else if (text.includes("nom du bailleur")) data.nom_du_bailleur = nextText;
        else if (text.includes("mobile contractuelles")) data.mobile_contractuelles = nextText;
        else if (text.includes("adresse du bailleur")) data.adresse_de_bailleur = nextText;
        else if (text.includes("téléphone contractuelles")) data.telephone_contractuelles = nextText;
        else if (text.includes("fax contractuelles")) data.fax_contractuelles = nextText;
        else if (text.includes("loyer")) data.loyer = nextText;
        else if (text.includes("modification du contrat 1")) data.modification_de_contrat1 = nextText;
        else if (text.includes("modification du contrat 2")) data.modification_de_contrat2 = nextText;
        else if (text.includes("date de consignation")) data.date_consignation = nextText;
        else if (text.includes("documents11")) data.documents11 = nextText;
        else if (text.includes("documents12")) data.documents12 = nextText;
        else if (text.includes("documents13")) data.documents13 = nextText;
        else if (text.includes("documents14")) data.documents14 = nextText;
        else if (text.includes("documents21")) data.documents21 = nextText;
        else if (text.includes("documents22")) data.documents22 = nextText;
        else if (text.includes("documents23")) data.documents23 = nextText;
        else if (text.includes("documents24")) data.documents24 = nextText;
        else if (text.includes("documents31")) data.documents31 = nextText;
        else if (text.includes("documents32")) data.documents32 = nextText;
        else if (text.includes("documents33")) data.documents33 = nextText;
        else if (text.includes("documents34")) data.documents34 = nextText;
        else if (text.includes("negociateur")) data.negociateur = nextText;
        else if (text.includes("date négociateur")) data.date_negociateur = nextText;
        else if (text.includes("responsable national acquisition")) data.responsable_national_acquisition = nextText;
        else if (text.includes("signature pour validation")) data.signature_validation = nextText;
        else if (text.includes("date responsable national acquisition")) data.date_responsable_national_acquisition = nextText;
        else if (text.includes("responsable national acquisition hors grille")) data.responsable_national_acquisition_hors_grille = nextText;
        else if (text.includes("signature responsable national acquisition hors grille")) data.signature_responsable_national_acquisition_hors_grille = nextText;
        else if (text.includes("date responsable national acquisition hors grille")) data.date_responsable_national_acquisition_hors_grille = nextText;
    }


}

const processExtractedText = (text: string[], step?: string) => {

    switch (step){
        case 'sa1':
            return handleSa1(text)
        case 'sa2':
            return handleSa2(text)
        case 'sa3':
            return handleSa3(text)
        case 'sa4':
            return handleSa4(text)
        default:
            return handleSa1(text)
    }

};
