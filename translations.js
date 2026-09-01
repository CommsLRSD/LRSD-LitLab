// ============================================
// LitLab — Translations (English / French)
// ============================================
// Assessment Names, Screener Names, and Intervention Names are intentionally
// NOT translated — they are rendered directly from the JSON data files.

const TRANSLATIONS = {
    en: {
        // ── Page title ──
        page_title: 'LitLab — LRSD Literacy Resource',

        // ── Skip link ──
        skip_to_content: 'Skip to content',

        // ── Nav ──
        nav_home: 'Home',
        nav_flowchart: 'Flowchart',
        nav_interventions: 'Interventions',
        nav_scores: 'Understanding Scores & Percentiles',
        nav_original: 'Original Guide',
        nav_about: 'About',
        nav_interventions_mobile: 'Interventions Menu',
        nav_schedule: 'Assessment Schedule',
        nav_lang_toggle_label: 'Switch to French',
        nav_lang_code: 'FR',

        // ── Home hero ──
        hero_eyebrow: 'LRSD Literacy Resource',
        hero_title_html: 'Building <span class="accent-word">Lifelong</span><br>Literacy Together',
        hero_subtitle: 'Supporting educators in identifying and implementing effective literacy interventions for every learner.',

        // ── Home CTA cards ──
        cta_flowchart_title: 'Intervention Flowchart',
        cta_flowchart_desc: 'Step-by-step decision guide to navigate tiers of support based on student screening results.',
        cta_flowchart_btn: 'Start Flowchart',
        cta_interventions_title: 'Interventions Menu',
        cta_interventions_desc: 'Browse interventions and assessments filtered by screener, subtest, and literacy pillar.',
        cta_interventions_btn: 'Find Interventions',
        cta_scores_title: 'Understanding Scores & Percentiles',
        cta_scores_desc: 'Learn how standard scores, percentile ranks, and DIBELS risk categories are used to understand student performance.',
        cta_scores_btn: 'Learn More',
        cta_original_title: 'Original Literacy Interventions',
        cta_original_desc: 'View the original LRSD Literacy Interventions guide document in its published format.',
        cta_original_btn: 'View Guide',

        // ── Flowchart section ──
        flowchart_section_title: 'Intervention Flowchart',
        flowchart_section_subtitle: 'Step-by-step decision guide to navigate tiers of support based on student screening results',

        // ── Interventions section ──
        interventions_section_title: 'Interventions & Assessments Menu',
        interventions_section_subtitle: 'Follow the steps below to find resources matched to your screening results',
        wizard_choose_steps: 'Choose each step in order',
        wizard_step1_label: 'Step 1 · Screener',
        wizard_step2_label: 'Step 2 · Subtest',
        wizard_step3_label: 'Step 3 · Pillar',
        wizard_step4_label: 'Step 4 · Resource Type',
        wizard_select_placeholder: 'Select...',
        wizard_select_screener_first: 'Select screener first…',
        wizard_select_subtest_first: 'Select subtest first…',
        wizard_type_intervention: 'Intervention',
        wizard_type_assessment: 'Assessment',
        wizard_start_over: 'Start Over',
        wizard_results_none: 'No matching items found for the selected criteria.',
        wizard_all_pillars: 'All Pillars',
        wizard_all_subtests: 'All Subtests',
        wizard_validation_tier: 'Please select a Tier before searching.',
        wizard_validation_pillar: 'Please select a Literacy Pillar before searching.',
        wizard_validation_type: 'Please select a Type (Assessment or Intervention) before searching.',
        wizard_evidence_info_label: 'Show evidence and research based definitions',
        wizard_evidence_info_text: 'Evidence and research based definitions',

        // ── Assessment schedule section ──
        schedule_section_title: 'Assessment Schedule',
        schedule_section_subtitle: 'Universal screening and progress monitoring timeline for the English and French Immersion programs',
        schedule_intervention_period: 'Intervention Period',
        schedule_intervention_note: 'Interventions run between assessment windows and pause while assessments are underway.',
        schedule_report_cards: 'Report Cards',
        schedule_school_year: 'School Year',
        schedule_filter_label: 'Filter by program',
        schedule_grade_filter_label: 'Filter by Grade',
        schedule_grade_all: 'All grades',
        schedule_grade_column: 'Grade',
        schedule_program_english: 'English Program',
        schedule_program_french: 'French Immersion Program',
        schedule_program_english_short: 'EN',
        schedule_program_french_short: 'FR',
        schedule_legend_midmonth: 'Dotted line marks the middle of each month',
        schedule_legend_assessment_types: 'Assessment Types',
        schedule_legend_notes: 'Notes',
        schedule_month_before: 'Before',
        schedule_month_sep: 'Sep',
        schedule_month_oct: 'Oct',
        schedule_month_nov: 'Nov',
        schedule_month_dec: 'Dec',
        schedule_month_jan: 'Jan',
        schedule_month_feb: 'Feb',
        schedule_month_mar: 'Mar',
        schedule_month_apr: 'Apr',
        schedule_month_may: 'May',
        schedule_month_jun: 'Jun',

        // ── Scores section ──
        scores_section_title: 'Understanding Scores & Percentiles',
        scores_section_subtitle: 'A reference guide to interpreting student screening results',
        scores_avg_percentile_title: 'Average Percentile Range',
        scores_avg_percentile_value: '16th to 84th percentile',
        scores_avg_standard_title: 'Average Standard Score Range',
        scores_avg_standard_value: '85 to 115 standard score',
        scores_acc_percentile_title: 'What percentile ranks mean',
        scores_acc_percentile_p1: 'Percentile ranks compare a student to same-age peers. A percentile of 16 means the student scored as well as or better than 16% of peers; a percentile of 75 means as well as or better than 75% of peers.',
        scores_acc_percentile_p2: 'Percentiles are not the same as percent correct. They show relative standing, not the number of test items answered correctly.',
        scores_acc_standard_title: 'What standard scores mean',
        scores_acc_standard_p1: 'Standard scores make it easier to compare results across measures. Most tests use 100 as the average score and 15-point intervals to describe score ranges.',
        scores_acc_standard_p2: 'A standard score from 85 to 115 is typically considered average.',
        scores_acc_dibels_title: 'DIBELS risk categories',
        scores_acc_dibels_intro: 'DIBELS categories indicate the likelihood of meeting end-of-year grade-level reading goals.',
        scores_dibels_blue: 'Blue — Above Benchmark',
        scores_dibels_blue_desc: 'Core support; negligible risk.',
        scores_dibels_green: 'Green — At Benchmark',
        scores_dibels_green_desc: 'Core support; minimal risk.',
        scores_dibels_yellow: 'Yellow — Some Risk',
        scores_dibels_yellow_desc: 'Strategic small-group support and progress monitoring.',
        scores_dibels_red: 'Red — At Risk',
        scores_dibels_red_desc: 'Intensive support with close progress monitoring.',

        // ── Original guide section ──
        original_section_title: 'Original Literacy Interventions',
        original_section_subtitle: 'View the original LRSD Literacy Interventions guide document',

        // ── About section ──
        about_section_title: 'About',
        about_section_subtitle: 'Welcome to Literacy Interventions, an interactive teaching guide by the Louis Riel School Division.',
        about_heading_purpose: 'Purpose of This Document',
        about_purpose_p1: 'This document is designed to support teachers, clinicians, principals, and vice-principals in interpreting data while collaboratively and effectively planning for instruction and intervention.',
        about_purpose_p2: 'It includes a schedule detailing the universal screening and progress monitoring required at each grade level for both English and French Immersion programs. Additionally, it features interactive content to help interpret data and determine next steps.',
        about_heading_frequency: 'Frequency of Screening and Progress Monitoring',
        about_frequency_p1: 'In 2023, the Ontario Human Rights Commission\'s Two-Year Update Right to Read report recommended conducting at least two screenings per year in K-2. The Saskatchewan Human Rights Commission suggested two to three times annually. The creators of DIBELS at the University of Oregon recommend progress monitoring three times per year. Reviewing the HRC reports, various research studies, and consultations with researchers in the field informed the Screening and Progress Monitoring Schedule adopted by LRSD and included in this document. The schedule applies to all students in LRSD in K-8. This schedule will be reviewed annually to ensure the timing and frequency of assessments continue to support student learning and educator needs while also being aligned with best practices as outlined in the research.',
        about_heading_access: 'Access to Data and Its Importance',
        about_access_p1: 'Specific reports have been developed for teachers to access student screening and progress monitoring data in Power BI. These reports are available in the PowerBI teacher workspace. School leaders and student services teachers also have access to school- and system-level reports through their respective Power BI workspaces. Using this evidence-based data to inform instructional planning is essential, which is why the screening process is so important.',
        about_heading_rti: 'Planning for Intervention: RTI and MTSS',
        about_rti_p1: 'This document provides a step-by-step tool that allows teachers to input observations and data results, leading to recommendations for next steps. LRSD strongly advocates for the application of the principles of Response to Intervention (RTI) and Multi-Tiered System of Supports (MTSS) to guide all intervention planning, ensuring all students, including those with reading difficulties or learning disabilities, receive high-quality instruction and targeted support.',
        about_rti_p2: 'RTI is a proactive, data-driven framework that helps teachers make informed decisions and adjust instruction to improve student learning. It follows a three-tier model:',
        about_rti_tier1: '<strong>Tier 1:</strong> Research-supported teaching practices in regular classrooms.',
        about_rti_tier2: '<strong>Tier 2:</strong> Targeted support for students needing additional assistance.',
        about_rti_tier3: '<strong>Tier 3:</strong> Intensive, individualized interventions for students who continue to struggle.',
        about_rti_p3: 'MTSS builds on RTI by incorporating a tiered approach that addresses not only academic needs but also social, emotional, and behavioral development. Within MTSS, reading interventions are categorized based on their place in the framework, focusing on foundational skills for struggling readers and using progress monitoring assessments to guide intervention planning.',
        about_rti_p4: 'All interventions should be evidence-based or aligned with effective classroom instruction methods to maximize student success.',
        about_heading_living: 'A Living Document',
        about_living_p1: 'This resource is a living document that will be updated periodically. Please continue using the provided link to ensure you are accessing the latest version. There is also a link provided to collect feedback. Please use the link to share your feedback to support the improvement of this document over time.',
        about_heading_dev: 'Development and Acknowledgements',
        about_dev_p1: 'This document is the result of a collaborative effort to make the vast resources available on the Teaching and Learning Portal more practical and accessible for educators. It is intended to reflect best practices based on widely accepted research, extensive consultations, and numerous discussions with researchers, practitioners, and specialists in the field of evidence-based literacy instruction and intervention.',
        about_dev_p2: 'LRSD would like to acknowledge Rob George, Karla Gutierrez, Nicholas Kelly, Kristen McDowell, Geneviève Shyiak, Lisa Tymchuk, and Dr. Caroline Erdos for their contributions to this resource. Additionally, we must recognize Cody Sellar for his vision and creativity in bringing this project to life in its electronic and interactive format.',
        about_feedback_text: 'We want to hear from you! Let us know what you think of this project.',
        about_feedback_btn: 'Provide your feedback',

        // ── Footer ──
        footer_text: '© 2025–2026 LitLab · Louis Riel School Division · Supporting educators in literacy intervention',

        // ── Selection history / tracker ──
        history_label: 'History',
        history_panel_label: 'Selection History',
        history_panel_intro: 'A running record of every drill-down assessment and intervention you select in the flowchart, grouped by session with the date you chose each item.',
        history_panel_warning: 'This history is saved only in this browser. Clearing your browser cache or site data will permanently erase it. Export to CSV to keep a copy.',
        history_export_csv: 'Export CSV',
        history_clear_all: 'Clear All',

        // ── Flowchart UI (dynamic) ──
        fc_back: 'Back',
        fc_your_decisions: 'Your Decisions',
        fc_summary_view: 'Summary View',
        fc_standard_view: 'Standard View',
        fc_switch_summary: 'Switch to summary view',
        fc_switch_standard: 'Switch to standard view',
        fc_back_one_step: 'Back one step',
        fc_screener_label: 'Screener:',
        fc_tier_label: 'Tier',
        fc_step_label: 'Step',
        fc_step_of: 'of',
        fc_in_progress: 'In progress',
        fc_coming_up: 'Coming up next',
        fc_revisit: 'Revisit',

        // ── Step type labels ──
        step_type_check: 'Check',
        step_type_choose: 'Choose',
        step_type_decide: 'Decide',
        step_type_read: 'Read',
        step_type_outcome: 'Outcome',
        step_type_step: 'Step',
        step_type_reviewed: 'Reviewed',

        // ── Tier transition ──
        go_to_tier: 'Go to Tier',
        go_to_tier_note: 'You are moving on to the next tier of support.',
        continue_to_tier: 'Continue to Tier',
        moving_to_tier: 'Moving to Tier',
        tier1_sidebar_heading: 'How do we determine if instruction is Successful or Unsuccessful?',
        tier1_blue_green_label: 'Blue and Green Indicators',
        tier1_blue_green_desc: 'If student screener results indicate Blue or Green in all areas, instruction is successful.',
        tier1_yellow_red_label: 'Yellow and Red Indicators',
        tier1_yellow_red_desc: 'If student screener results indicate Yellow or Red in any one area, instruction is unsuccessful.',
        tier1_monitoring_note: 'Monitoring and interventions are needed.',
        tier1_see_scores: 'See Understanding Scores & Percentiles',

        // ── Route complete gate ──
        gate_title: 'Route Complete',
        gate_subtitle_steps: (n) => `You completed ${n} step${n !== 1 ? 's' : ''} across`,
        gate_desc: 'Click below to see a visual summary of your complete intervention pathway.',
        gate_view_summary: 'View Journey Summary',
        anim_skip: 'Skip animation',

        // ── Recommendations ──
        recommendations_title: 'Recommendations',
        go_back: 'Go Back',

        // ── Tier labels (tabs and name bar) ──
        tier1_label: 'Tier 1',
        tier2_label: 'Tier 2',
        tier3_label: 'Tier 3',

        // ── Check all ──
        check_all: 'Check All',
        uncheck_all: 'Uncheck All',
        all_reviewed: (n) => `All ${n} principles reviewed ✓`,

        // ── Journey map count ──
        journey_step_count: (n) => `Step ${n}`,
        journey_step_of: (n, total) => `Step ${n} of ${total}`,
        journey_complete: 'Complete',

        // ── Final summary ──
        final_summary_close: 'Close summary',
        tier_complete: 'Tier complete',

        // ── Evidence popup ──
        evidence_eb_title: '* Evidence Based: Most rigorous and trusted',
        evidence_eb_desc: 'Definition: The program or practice has been tested through high-quality peer reviewed research (often randomized controlled trials or quasi-experimental studies) and has demonstrated statistically significant positive outcomes.',
        evidence_rb_title: '** Research Based: Less rigorous than evidence-based',
        evidence_rb_desc: 'Definition: The program is based on sound theories or methods that have been validated by some research, but the program itself may not have been directly studied for evidence of its effectiveness.',

        // ── FW results ──
        fw_no_results: 'No matching items found for the selected criteria.',
        fw_results_label: (n) => `${n} result${n !== 1 ? 's' : ''}`,
        fw_time_prefix: 'Time:',
        fw_grade_prefix: 'Gr.',
    },

    fr: {
        // ── Page title ──
        page_title: 'LitLab — Ressource en littératie de la DSLR',

        // ── Skip link ──
        skip_to_content: 'Passer au contenu',

        // ── Nav ──
        nav_home: 'Accueil',
        nav_flowchart: 'Organigramme',
        nav_interventions: 'Interventions',
        nav_scores: 'Comprendre les scores et les percentiles',
        nav_original: 'Guide original',
        nav_about: 'À propos',
        nav_interventions_mobile: 'Menu des interventions',
        nav_schedule: 'Calendrier d\'évaluation',
        nav_lang_toggle_label: 'Passer à l\'anglais',
        nav_lang_code: 'EN',

        // ── Home hero ──
        hero_eyebrow: 'Ressource en littératie de la DSLR',
        hero_title_html: 'Bâtir ensemble une <span class="accent-word">littératie</span><br>pour la vie',
        hero_subtitle: 'Soutenir les enseignants dans l\'identification et la mise en œuvre d\'interventions efficaces en littératie pour chaque apprenant.',

        // ── Home CTA cards ──
        cta_flowchart_title: 'Organigramme d\'intervention',
        cta_flowchart_desc: 'Guide de décision étape par étape pour naviguer dans les paliers de soutien en fonction des résultats de dépistage des élèves.',
        cta_flowchart_btn: 'Démarrer l\'organigramme',
        cta_interventions_title: 'Menu des interventions',
        cta_interventions_desc: 'Parcourir les interventions et les évaluations filtrées par outil de dépistage, sous-test et pilier de la littératie.',
        cta_interventions_btn: 'Trouver des interventions',
        cta_scores_title: 'Comprendre les scores et les percentiles',
        cta_scores_desc: 'Découvrir comment les scores standards, les rangs percentiles et les catégories de risque DIBELS sont utilisés pour comprendre les résultats des élèves.',
        cta_scores_btn: 'En savoir plus',
        cta_original_title: 'Interventions en littératie — guide original',
        cta_original_desc: 'Consulter le document original du guide d\'interventions en littératie de la DSLR dans son format publié.',
        cta_original_btn: 'Voir le guide',

        // ── Flowchart section ──
        flowchart_section_title: 'Organigramme d\'intervention',
        flowchart_section_subtitle: 'Guide de décision étape par étape pour naviguer dans les paliers de soutien en fonction des résultats de dépistage',

        // ── Interventions section ──
        interventions_section_title: 'Menu des interventions et des évaluations',
        interventions_section_subtitle: 'Suivez les étapes ci-dessous pour trouver des ressources correspondant à vos résultats de dépistage',
        wizard_choose_steps: 'Choisissez chaque étape dans l\'ordre',
        wizard_step1_label: 'Étape 1 · Outil de dépistage',
        wizard_step2_label: 'Étape 2 · Sous-test',
        wizard_step3_label: 'Étape 3 · Pilier',
        wizard_step4_label: 'Étape 4 · Type de ressource',
        wizard_select_placeholder: 'Sélectionner...',
        wizard_select_screener_first: 'Sélectionner d\'abord un outil de dépistage…',
        wizard_select_subtest_first: 'Sélectionner d\'abord un sous-test…',
        wizard_type_intervention: 'Intervention',
        wizard_type_assessment: 'Évaluation',
        wizard_start_over: 'Recommencer',
        wizard_results_none: 'Aucun élément correspondant aux critères sélectionnés.',
        wizard_all_pillars: 'Tous les piliers',
        wizard_all_subtests: 'Tous les sous-tests',
        wizard_validation_tier: 'Veuillez sélectionner un niveau (Tier) avant de rechercher.',
        wizard_validation_pillar: 'Veuillez sélectionner un pilier de littératie avant de rechercher.',
        wizard_validation_type: 'Veuillez sélectionner un type (évaluation ou intervention) avant de rechercher.',
        wizard_evidence_info_label: 'Afficher les définitions fondées sur des données probantes et la recherche',
        wizard_evidence_info_text: 'Définitions fondées sur des données probantes et la recherche',

        // ── Assessment schedule section ──
        schedule_section_title: 'Calendrier d\'évaluation',
        schedule_section_subtitle: 'Calendrier de dépistage universel et de suivi des progrès pour les programmes anglais et d\'immersion française',
        schedule_intervention_period: 'Période d\'intervention',
        schedule_intervention_note: 'Les interventions se déroulent entre les périodes d\'évaluation et s\'interrompent pendant celles-ci.',
        schedule_report_cards: 'Bulletins',
        schedule_school_year: 'Année scolaire',
        schedule_filter_label: 'Filtrer par programme',
        schedule_grade_filter_label: 'Filtrer par niveau',
        schedule_grade_all: 'Tous les niveaux',
        schedule_grade_column: 'Niveau',
        schedule_program_english: 'Programme anglais',
        schedule_program_french: 'Programme d\'immersion française',
        schedule_program_english_short: 'EN',
        schedule_program_french_short: 'FR',
        schedule_legend_midmonth: 'La ligne pointillée marque le milieu de chaque mois',
        schedule_legend_assessment_types: 'Types d\'évaluation',
        schedule_legend_notes: 'Remarques',
        schedule_month_before: 'Avant',
        schedule_month_sep: 'Sept',
        schedule_month_oct: 'Oct',
        schedule_month_nov: 'Nov',
        schedule_month_dec: 'Déc',
        schedule_month_jan: 'Janv',
        schedule_month_feb: 'Févr',
        schedule_month_mar: 'Mars',
        schedule_month_apr: 'Avr',
        schedule_month_may: 'Mai',
        schedule_month_jun: 'Juin',

        // ── Scores section ──
        scores_section_title: 'Comprendre les scores et les percentiles',
        scores_section_subtitle: 'Un guide de référence pour interpréter les résultats de dépistage des élèves',
        scores_avg_percentile_title: 'Plage de percentiles moyenne',
        scores_avg_percentile_value: '16e au 84e percentile',
        scores_avg_standard_title: 'Plage de scores standards moyenne',
        scores_avg_standard_value: 'Score standard de 85 à 115',
        scores_acc_percentile_title: 'Ce que signifient les rangs percentiles',
        scores_acc_percentile_p1: 'Les rangs percentiles comparent un élève à des pairs du même âge. Un percentile de 16 signifie que l\'élève a obtenu un résultat aussi bon ou meilleur que 16 % de ses pairs; un percentile de 75 signifie aussi bon ou meilleur que 75 % de ses pairs.',
        scores_acc_percentile_p2: 'Les percentiles ne correspondent pas aux pourcentages de bonnes réponses. Ils indiquent le classement relatif, et non le nombre de questions auxquelles l\'élève a répondu correctement.',
        scores_acc_standard_title: 'Ce que signifient les scores standards',
        scores_acc_standard_p1: 'Les scores standards facilitent la comparaison des résultats entre différentes mesures. La plupart des tests utilisent 100 comme score moyen et des intervalles de 15 points pour décrire les plages de scores.',
        scores_acc_standard_p2: 'Un score standard de 85 à 115 est généralement considéré comme dans la moyenne.',
        scores_acc_dibels_title: 'Catégories de risque DIBELS',
        scores_acc_dibels_intro: 'Les catégories DIBELS indiquent la probabilité que l\'élève atteigne les objectifs de lecture de fin d\'année correspondant à son niveau scolaire.',
        scores_dibels_blue: 'Bleu — Au-dessus du niveau de référence',
        scores_dibels_blue_desc: 'Soutien de base; risque négligeable.',
        scores_dibels_green: 'Vert — Au niveau de référence',
        scores_dibels_green_desc: 'Soutien de base; risque minimal.',
        scores_dibels_yellow: 'Jaune — Quelque risque',
        scores_dibels_yellow_desc: 'Soutien en petit groupe stratégique et suivi des progrès.',
        scores_dibels_red: 'Rouge — À risque',
        scores_dibels_red_desc: 'Soutien intensif avec suivi étroit des progrès.',

        // ── Original guide section ──
        original_section_title: 'Interventions en littératie — guide original',
        original_section_subtitle: 'Consulter le document original du guide d\'interventions en littératie de la DSLR',

        // ── About section ──
        about_section_title: 'À propos',
        about_section_subtitle: 'Bienvenue dans Interventions en littératie, un guide d\'enseignement interactif de la Division scolaire Louis-Riel.',
        about_heading_purpose: 'Objectif de ce document',
        about_purpose_p1: 'Ce document est conçu pour aider les enseignants, les cliniciens, les directeurs et les directeurs adjoints à interpréter les données tout en planifiant de manière collaborative et efficace l\'enseignement et les interventions.',
        about_purpose_p2: 'Il comprend un calendrier détaillant le dépistage universel et le suivi des progrès requis à chaque niveau scolaire, tant pour les programmes d\'anglais que d\'immersion française. Il contient également du contenu interactif pour aider à interpréter les données et à déterminer les prochaines étapes.',
        about_heading_frequency: 'Fréquence du dépistage et du suivi des progrès',
        about_frequency_p1: 'En 2023, la mise à jour biennale du rapport « Droit à la lecture » de la Commission des droits de la personne de l\'Ontario recommandait d\'effectuer au moins deux dépistages par année en maternelle à la 2e année. La Commission des droits de la personne de la Saskatchewan en suggérait deux à trois par an. Les créateurs de DIBELS à l\'Université de l\'Oregon recommandent un suivi des progrès trois fois par an. L\'examen des rapports des commissions des droits de la personne, de diverses études de recherche et des consultations avec des chercheurs dans ce domaine ont éclairé le Calendrier de dépistage et de suivi des progrès adopté par la DSLR et inclus dans ce document. Le calendrier s\'applique à tous les élèves de la DSLR de la maternelle à la 8e année. Ce calendrier sera révisé annuellement pour s\'assurer que le moment et la fréquence des évaluations continuent de soutenir l\'apprentissage des élèves et les besoins des enseignants, tout en étant alignés sur les meilleures pratiques décrites dans la recherche.',
        about_heading_access: 'Accès aux données et leur importance',
        about_access_p1: 'Des rapports spécifiques ont été développés pour que les enseignants accèdent aux données de dépistage et de suivi des progrès des élèves dans Power BI. Ces rapports sont disponibles dans l\'espace de travail Power BI des enseignants. Les dirigeants scolaires et les enseignants des services aux élèves ont également accès à des rapports au niveau de l\'école et du système dans leurs espaces de travail Power BI respectifs. L\'utilisation de ces données probantes pour guider la planification pédagogique est essentielle, c\'est pourquoi le processus de dépistage est si important.',
        about_heading_rti: 'Planification de l\'intervention : RTI et MTSS',
        about_rti_p1: 'Ce document fournit un outil étape par étape qui permet aux enseignants de saisir des observations et des résultats de données, menant à des recommandations pour les prochaines étapes. La DSLR préconise fortement l\'application des principes de la Réponse à l\'intervention (RTI) et du Système de soutien à plusieurs niveaux (MTSS) pour guider toute planification d\'intervention, en veillant à ce que tous les élèves, y compris ceux ayant des difficultés de lecture ou des troubles d\'apprentissage, reçoivent un enseignement de haute qualité et un soutien ciblé.',
        about_rti_p2: 'Le RTI est un cadre proactif et axé sur les données qui aide les enseignants à prendre des décisions éclairées et à adapter l\'enseignement pour améliorer l\'apprentissage des élèves. Il suit un modèle à trois niveaux :',
        about_rti_tier1: '<strong>Palier 1 :</strong> Pratiques d\'enseignement appuyées par la recherche dans les classes régulières.',
        about_rti_tier2: '<strong>Palier 2 :</strong> Soutien ciblé pour les élèves ayant besoin d\'aide supplémentaire.',
        about_rti_tier3: '<strong>Palier 3 :</strong> Interventions intensives et individualisées pour les élèves qui continuent à éprouver des difficultés.',
        about_rti_p3: 'Le MTSS s\'appuie sur le RTI en intégrant une approche à plusieurs niveaux qui répond non seulement aux besoins académiques, mais aussi au développement social, émotionnel et comportemental. Dans le MTSS, les interventions en lecture sont classées selon leur place dans le cadre, en se concentrant sur les compétences fondamentales pour les élèves en difficulté de lecture et en utilisant des évaluations de suivi des progrès pour guider la planification des interventions.',
        about_rti_p4: 'Toutes les interventions devraient être fondées sur des données probantes ou alignées sur des méthodes d\'enseignement efficaces en classe afin de maximiser la réussite des élèves.',
        about_heading_living: 'Un document évolutif',
        about_living_p1: 'Cette ressource est un document évolutif qui sera mis à jour périodiquement. Veuillez continuer à utiliser le lien fourni pour vous assurer d\'accéder à la dernière version. Un lien est également fourni pour recueillir des commentaires. Veuillez utiliser ce lien pour partager vos commentaires afin de soutenir l\'amélioration de ce document au fil du temps.',
        about_heading_dev: 'Développement et remerciements',
        about_dev_p1: 'Ce document est le résultat d\'un effort collaboratif visant à rendre les vastes ressources disponibles sur le Portail d\'enseignement et d\'apprentissage plus pratiques et accessibles pour les éducateurs. Il est destiné à refléter les meilleures pratiques fondées sur des recherches largement acceptées, de nombreuses consultations et de nombreuses discussions avec des chercheurs, des praticiens et des spécialistes dans le domaine de l\'enseignement et des interventions en littératie fondés sur des données probantes.',
        about_dev_p2: 'La DSLR tient à remercier Rob George, Karla Gutierrez, Nicholas Kelly, Kristen McDowell, Geneviève Shyiak, Lisa Tymchuk et la Dr Caroline Erdos pour leurs contributions à cette ressource. De plus, nous devons reconnaître Cody Sellar pour sa vision et sa créativité dans la réalisation de ce projet dans son format électronique et interactif.',
        about_feedback_text: 'Nous voulons vous entendre! Dites-nous ce que vous pensez de ce projet.',
        about_feedback_btn: 'Donner votre avis',

        // ── Footer ──
        footer_text: '© 2025–2026 LitLab · Division scolaire Louis-Riel · Soutenir les éducateurs dans les interventions en littératie',

        // ── Selection history / tracker ──
        history_label: 'Historique',
        history_panel_label: 'Historique des sélections',
        history_panel_intro: 'Un registre continu de chaque évaluation approfondie et intervention que vous sélectionnez dans l\'organigramme, regroupé par session avec la date à laquelle vous avez choisi chaque élément.',
        history_panel_warning: 'Cet historique est sauvegardé uniquement dans ce navigateur. Vider le cache de votre navigateur ou les données du site effacera définitivement cet historique. Exportez en CSV pour en conserver une copie.',
        history_export_csv: 'Exporter en CSV',
        history_clear_all: 'Tout effacer',

        // ── Flowchart UI (dynamic) ──
        fc_back: 'Retour',
        fc_your_decisions: 'Vos décisions',
        fc_summary_view: 'Vue sommaire',
        fc_standard_view: 'Vue standard',
        fc_switch_summary: 'Passer à la vue sommaire',
        fc_switch_standard: 'Passer à la vue standard',
        fc_back_one_step: 'Revenir d\'une étape',
        fc_screener_label: 'Dépistage\u00a0:',
        fc_tier_label: 'Palier',
        fc_step_label: 'Étape',
        fc_step_of: 'sur',
        fc_in_progress: 'En cours',
        fc_coming_up: 'Prochainement',
        fc_revisit: 'Revoir',

        // ── Step type labels ──
        step_type_check: 'Vérifier',
        step_type_choose: 'Choisir',
        step_type_decide: 'Décider',
        step_type_read: 'Lire',
        step_type_outcome: 'Résultat',
        step_type_step: 'Étape',
        step_type_reviewed: 'Examiné',

        // ── Tier transition ──
        go_to_tier: 'Aller au palier',
        go_to_tier_note: 'Vous passez au prochain palier de soutien.',
        continue_to_tier: 'Continuer vers le palier',
        moving_to_tier: 'Passage au palier',
        tier1_sidebar_heading: 'Comment détermine-t-on si l\'enseignement est efficace ou inefficace?',
        tier1_blue_green_label: 'Indicateurs bleu et vert',
        tier1_blue_green_desc: 'Si les résultats de dépistage de l\'élève indiquent Bleu ou Vert dans tous les domaines, l\'enseignement est efficace.',
        tier1_yellow_red_label: 'Indicateurs jaune et rouge',
        tier1_yellow_red_desc: 'Si les résultats de dépistage de l\'élève indiquent Jaune ou Rouge dans un domaine quelconque, l\'enseignement est inefficace.',
        tier1_monitoring_note: 'Un suivi et des interventions sont nécessaires.',
        tier1_see_scores: 'Voir Comprendre les scores et les percentiles',

        // ── Route complete gate ──
        gate_title: 'Parcours terminé',
        gate_subtitle_steps: (n) => `Vous avez complété ${n} étape${n !== 1 ? 's' : ''} dans`,
        gate_desc: 'Cliquez ci-dessous pour voir un résumé visuel de votre parcours d\'intervention complet.',
        gate_view_summary: 'Voir le résumé du parcours',
        anim_skip: 'Passer l\'animation',

        // ── Recommendations ──
        recommendations_title: 'Recommandations',
        go_back: 'Retour',

        // ── Tier labels (tabs and name bar) ──
        tier1_label: 'Palier 1',
        tier2_label: 'Palier 2',
        tier3_label: 'Palier 3',

        // ── Check all ──
        check_all: 'Tout cocher',
        uncheck_all: 'Tout décocher',
        all_reviewed: (n) => `Les ${n} principes ont été examinés ✓`,

        // ── Journey map count ──
        journey_step_count: (n) => `Étape ${n}`,
        journey_step_of: (n, total) => `Étape ${n} sur ${total}`,
        journey_complete: 'Terminé',

        // ── Final summary ──
        final_summary_close: 'Fermer le résumé',
        tier_complete: 'Palier terminé',

        // ── Evidence popup ──
        evidence_eb_title: '* Fondé sur des données probantes : Le plus rigoureux et fiable',
        evidence_eb_desc: 'Définition : Le programme ou la pratique a été testé dans le cadre de recherches évaluées par des pairs de haute qualité (souvent des essais contrôlés randomisés ou des études quasi-expérimentales) et a démontré des résultats positifs statistiquement significatifs.',
        evidence_rb_title: '** Fondé sur la recherche : Moins rigoureux que fondé sur des données probantes',
        evidence_rb_desc: 'Définition : Le programme est fondé sur des théories ou méthodes solides validées par certaines recherches, mais le programme lui-même n\'a peut-être pas été directement étudié pour des preuves de son efficacité.',

        // ── FW results ──
        fw_no_results: 'Aucun élément correspondant aux critères sélectionnés.',
        fw_results_label: (n) => `${n} résultat${n !== 1 ? 's' : ''}`,
        fw_time_prefix: 'Durée\u00a0:',
        fw_grade_prefix: 'Année',
    }
};

// ============================================
// French Flowchart Definitions
// (Assessment Names, Screener Names, and Intervention Names are NOT translated)
// ============================================
const FLOWCHART_DEFINITIONS_FR = {
    tier1: {
        title: 'Palier UN\u00a0: Classe universelle',
        startNode: 'tier1-principles',
        nodes: {
            'tier1-principles': {
                id: 'tier1-principles',
                type: 'checklist',
                title: '\u00c9tape 1\u00a0: Principes de l\u2019enseignement explicite et syst\u00e9matique',
                subtitle: 'Principes de l\u2019enseignement explicite et syst\u00e9matique',
                description: 'Examinez les principes suivants avant de continuer.',
                items: [
                    'Les objectifs de la le\u00e7on sont-ils clairement \u00e9nonc\u00e9s\u00a0?',
                    'Le contenu est-il pr\u00e9sent\u00e9 en \u00e9tapes compr\u00e9hensibles et logiquement ordonn\u00e9es, guid\u00e9 par la Progression des apprentissages de la DSLR\u00a0?',
                    'Une r\u00e9troaction corrective imm\u00e9diate est-elle fournie\u00a0?',
                    'La pratique guid\u00e9e et soutenue est-elle suffisante pour mener \u00e0 une application fluide\u00a0?',
                    'Les activit\u00e9s sont-elles utilis\u00e9es pour atteindre des objectifs sp\u00e9cifiques\u00a0?',
                    'Y a-t-il un plan pour r\u00e9enseigner au besoin\u00a0?',
                    'Les progr\u00e8s sont-ils suivis\u00a0?',
                    'L\u2019enseignement int\u00e8gre-t-il la conception simple de la lecture\u00a0?'
                ],
                nextNode: 'tier1-screener',
                buttonText: 'Continuer vers le d\u00e9pistage en litt\u00e9ratie'
            },
            'tier1-screener': {
                id: 'tier1-screener',
                type: 'selection',
                title: '\u00c9tape 2\u00a0: D\u00e9pistage en litt\u00e9ratie',
                subtitle: 'Administrer un outil de d\u00e9pistage en litt\u00e9ratie.',
                description: 'Administrer un outil de d\u00e9pistage en litt\u00e9ratie.\n\n(DIBELS, CTOPP-2, THaFol, IDAPEL)',
                options: 'screeners',
                nextNode: 'tier1-effectiveness',
                nextHandler: 'selectTier1ScreenerVisual'
            },
            'tier1-effectiveness': {
                id: 'tier1-effectiveness',
                type: 'decision',
                title: '\u00c9tape 3\u00a0: R\u00e9sultat',
                subtitle: 'L\u2019enseignement \u00e9tait-il efficace\u00a0?',
                description: 'Administrer un outil de d\u00e9pistage en litt\u00e9ratie. (DIBELS, CTOPP-2, THaFol, IDAPEL)\n\nSi vous avez choisi la mauvaise option, choisissez simplement la bonne et continuez.',
                choices: [
                    { id: 'effective', label: 'Enseignement efficace', sublabel: 'R\u00e9sultat du sous-test Bleu ou Vert', type: 'success', nextNode: 'tier1-success' },
                    { id: 'ineffective', label: 'Enseignement inefficace', sublabel: 'R\u00e9sultat du sous-test Jaune ou Rouge', type: 'warning', nextNode: 'tier1-percentage' }
                ]
            },
            'tier1-success': {
                id: 'tier1-success',
                type: 'endpoint',
                status: 'success',
                title: '\u00c9tape 3\u00a0: Succ\u00e8s\u00a0!',
                description: 'Continuer et suivre avec le curriculum g\u00e9n\u00e9ral.',
                recommendations: [
                    'Continuer et suivre avec le curriculum g\u00e9n\u00e9ral'
                ]
            },
            'tier1-percentage': {
                id: 'tier1-percentage',
                type: 'decision',
                title: 'Voie B\u00a0: Enseignement inefficace',
                subtitle: 'Quel pourcentage d\u2019\u00e9l\u00e8ves est en difficult\u00e9\u00a0?',
                description: 'D\u2019apr\u00e8s les r\u00e9sultats du d\u00e9pistage, combien d\u2019\u00e9l\u00e8ves sont en dessous du niveau de r\u00e9f\u00e9rence\u00a0?',
                choices: [
                    { id: 'more-20', label: 'Enseignement inefficace pour 20\u00a0% ou plus des \u00e9l\u00e8ves.', sublabel: '', type: 'warning', nextNode: 'tier1-move-tier2' },
                    { id: 'less-20', label: 'Enseignement inefficace pour moins de 20\u00a0% des \u00e9l\u00e8ves.', sublabel: '', type: 'warning', nextNode: 'tier1-reteach' }
                ]
            },
            'tier1-move-tier2': {
                id: 'tier1-move-tier2',
                type: 'endpoint',
                status: 'info',
                title: 'Palier 2\u00a0: Interventions en petits groupes',
                description: 'Enseignement inefficace pour 20\u00a0% ou plus des \u00e9l\u00e8ves. Ce parcours continue vers l\u2019organigramme du palier deux.',
                recommendations: [
                    'Continuer vers l\u2019organigramme du palier deux.'
                ],
                actionButton: { text: 'D\u00e9marrer l\u2019organigramme du palier 2', action: 'startTier2Visual' }
            },
            'tier1-reteach': {
                id: 'tier1-reteach',
                type: 'endpoint',
                status: 'warning',
                title: '\u00c9tape 3\u00a0: R\u00e9enseigner le curriculum g\u00e9n\u00e9ral',
                description: 'Consid\u00e9rer les points faibles identifi\u00e9s par le d\u00e9pistage en litt\u00e9ratie. Utilisez le menu des interventions ci-dessous pour trouver des ressources.\n\nCe parcours reste dans le palier un.',
                recommendations: [
                    'Consid\u00e9rer les points faibles identifi\u00e9s par le d\u00e9pistage en litt\u00e9ratie.',
                    'Utiliser le menu des interventions ci-dessous pour trouver des ressources.'
                ],
                actionButton: { text: 'Reprendre le palier 1', action: 'restartTier1Visual' }
            }
        }
    },
    tier2: {
        title: 'Palier DEUX\u00a0: Intervention en petits groupes',
        startNode: 'tier2-principles',
        nodes: {
            'tier2-principles': {
                id: 'tier2-principles',
                type: 'checklist',
                title: '\u00c9tape 1\u00a0: Entr\u00e9e',
                journeySummary: 'Vous avez \u00e9cart\u00e9 les d\u00e9ficiences et autres obstacles comme cause des difficult\u00e9s en litt\u00e9ratie et confirm\u00e9 que les soutiens du palier 2 ont \u00e9t\u00e9 mis en place correctement.',
                reviewHint: 'Utilisez la carte du processus pour rouvrir cette \u00e9tape et revoir la liste en tout temps.',
                leadText: 'Inform\u00e9 par des donn\u00e9es (voir les outils de suivi des progr\u00e8s).',
                subtitle: '\u00c9carter que les d\u00e9fis ne sont pas le r\u00e9sultat de\u00a0:',
                items: [
                    'D\u00e9ficiences visuelles',
                    'D\u00e9ficiences auditives',
                    'Absences fr\u00e9quentes',
                    'Apprenant multilingue (ALM)',
                    'Autre diagnostic'
                ],
                postSections: [
                    {
                        title: 'Information sur le groupe',
                        items: [
                            'Dirig\u00e9 par les enseignants de la classe.',
                            'Environ 3 \u00e0 5 \u00e9l\u00e8ves par groupe.',
                            'Les \u00e9l\u00e8ves re\u00e7oivent un enseignement intensif, explicite et syst\u00e9matique en petits groupes bas\u00e9 sur des objectifs sp\u00e9cifiques en litt\u00e9ratie (pas n\u00e9cessairement au niveau de la classe), fond\u00e9s sur les cinq piliers de l\u2019enseignement de la lecture identifi\u00e9s par les enseignants, les services aux \u00e9l\u00e8ves et les administrateurs.',
                            'Les interventions sont mises en \u0153uvre pour une p\u00e9riode sugg\u00e9r\u00e9e de 20 \u00e0 40 minutes, trois \u00e0 cinq fois par semaine sur une p\u00e9riode de 8 semaines.'
                        ]
                    },
                    {
                        title: 'Suivi des progr\u00e8s',
                        items: [
                            'Suivi hebdomadaire des progr\u00e8s (ex.\u00a0: \u00e9valuations de suivi des progr\u00e8s UFLI, DIBELS).'
                        ]
                    },
                    {
                        title: 'Collaboration',
                        items: [
                            'Les membres de l\u2019\u00e9quipe partagent les r\u00e9sultats du suivi des progr\u00e8s lors des r\u00e9unions \u00e0 l\u2019\u00e9cole.'
                        ]
                    }
                ],
                nextNode: 'tier2-assessment',
                buttonText: 'Continuer vers l\u2019\u00e9valuation approfondie',
                useButton: true
            },
            'tier2-assessment': {
                id: 'tier2-assessment',
                type: 'selection',
                title: '\u00c9tape 2\u00a0: \u00c9valuation approfondie',
                subtitle: 'Administrer une \u00e9valuation approfondie.',
                description: 'Utilisez le menu ci-dessous pour trouver et administrer une \u00e9valuation approfondie correspondant aux besoins de vos \u00e9l\u00e8ves, tels que d\u00e9termin\u00e9s par le d\u00e9pistage en litt\u00e9ratie.',
                options: 'drillDownAssessments',
                nextNode: 'tier2-intervention',
                nextHandler: 'selectTier2AssessmentVisual'
            },
            'tier2-intervention': {
                id: 'tier2-intervention',
                type: 'selection',
                title: '\u00c9tape 3\u00a0: Intervention de 8 semaines',
                subtitle: 'S\u00e9lectionner et administrer une intervention de 8 semaines.',
                description: 'Utilisez le menu ci-dessous pour trouver une intervention appropri\u00e9e, suivez la r\u00e9ponse de l\u2019\u00e9l\u00e8ve avec des outils de suivi des progr\u00e8s (si n\u00e9cessaire) et administrez-la pendant une p\u00e9riode de 8 semaines.',
                options: 'interventions',
                nextNode: 'tier2-progress',
                nextHandler: 'selectTier2InterventionVisual'
            },
            'tier2-progress': {
                id: 'tier2-progress',
                type: 'decision',
                title: '\u00c9tape 4\u00a0: Suivi des progr\u00e8s',
                subtitle: 'L\u2019enseignement \u00e9tait-il efficace\u00a0?',
                description: 'Apr\u00e8s la p\u00e9riode de 8 semaines, administrer l\u2019outil de d\u00e9pistage de suivi des progr\u00e8s en litt\u00e9ratie planifi\u00e9 (DIBELS, CTOPP-2, THaFol, IDAPEL).\n\nSi vous avez choisi la mauvaise option, choisissez simplement la bonne et continuez.',
                choices: [
                    { id: 'improved', label: 'Enseignement efficace', sublabel: 'R\u00e9sultat du sous-test Bleu ou Vert', type: 'success', nextNode: 'tier2-success' },
                    { id: 'no-improvement', label: 'Enseignement inefficace', sublabel: 'R\u00e9sultat du sous-test Jaune ou Rouge', type: 'warning', nextNode: 'tier2-cycle2-assessment' }
                ]
            },
            'tier2-success': {
                id: 'tier2-success',
                type: 'endpoint',
                status: 'success',
                title: '\u00c9tape 5\u00a0: Succ\u00e8s\u00a0!',
                description: 'Envisager de r\u00e9duire progressivement les soutiens au palier 1 et de surveiller.',
                recommendations: [
                    'Envisager de r\u00e9duire progressivement les soutiens au palier 1 et de surveiller.'
                ]
            },
            'tier2-cycle2-assessment': {
                id: 'tier2-cycle2-assessment',
                type: 'selection',
                title: '\u00c9tape 5\u00a0: \u00c9valuation approfondie',
                subtitle: 'Administrer une deuxi\u00e8me \u00e9valuation approfondie.',
                description: 'Utilisez \u00e0 nouveau le menu pour trouver et administrer une \u00e9valuation approfondie correspondant aux besoins de vos \u00e9l\u00e8ves, tels que d\u00e9termin\u00e9s par le dernier d\u00e9pistage en litt\u00e9ratie.',
                options: 'drillDownAssessments',
                nextNode: 'tier2-cycle2-intervention',
                nextHandler: 'selectTier2AssessmentVisual'
            },
            'tier2-cycle2-intervention': {
                id: 'tier2-cycle2-intervention',
                type: 'selection',
                title: '\u00c9tape 6\u00a0: Intervention de 8 semaines',
                subtitle: 'Modifier ou continuer les interventions du palier 2.',
                description: 'Modifier ou continuer les interventions du palier 2 et suivre r\u00e9guli\u00e8rement la r\u00e9ponse de l\u2019\u00e9l\u00e8ve \u00e0 l\u2019intervention avec des outils de suivi des progr\u00e8s (si n\u00e9cessaire).',
                options: 'interventions',
                nextNode: 'tier2-cycle2-progress',
                nextHandler: 'selectTier2InterventionVisual'
            },
            'tier2-cycle2-progress': {
                id: 'tier2-cycle2-progress',
                type: 'decision',
                title: '\u00c9tape 7\u00a0: Suivi des progr\u00e8s',
                subtitle: 'L\u2019enseignement \u00e9tait-il efficace\u00a0?',
                description: 'Apr\u00e8s la p\u00e9riode de 8 semaines, administrer l\u2019outil de d\u00e9pistage de suivi des progr\u00e8s en litt\u00e9ratie planifi\u00e9 (DIBELS, CTOPP-2, THaFol, IDAPEL).\n\nSi vous avez choisi la mauvaise option, choisissez simplement la bonne et continuez.',
                choices: [
                    { id: 'improved', label: 'Enseignement efficace', sublabel: 'R\u00e9sultat du sous-test Bleu ou Vert', type: 'success', nextNode: 'tier2-cycle2-success' },
                    { id: 'no-improvement', label: 'Enseignement inefficace', sublabel: 'R\u00e9sultat du sous-test Jaune ou Rouge', type: 'warning', nextNode: 'tier2-move-tier3' }
                ]
            },
            'tier2-cycle2-success': {
                id: 'tier2-cycle2-success',
                type: 'endpoint',
                status: 'success',
                title: '\u00c9tape 8\u00a0: Succ\u00e8s\u00a0!',
                description: 'Envisager de r\u00e9duire progressivement les soutiens au palier 1 et de surveiller.',
                recommendations: [
                    'Envisager de r\u00e9duire progressivement les soutiens au palier 1 et de surveiller.'
                ]
            },
            'tier2-move-tier3': {
                id: 'tier2-move-tier3',
                type: 'endpoint',
                status: 'info',
                title: '\u00c9tape 8\u00a0: Passer au palier 3',
                description: 'Si l\u2019\u00e9l\u00e8ve ne fait pas de progr\u00e8s attendus au palier 2 apr\u00e8s deux cycles d\u2019intervention de 8 semaines, il passe au palier 3. Moins de 10\u00a0% des \u00e9l\u00e8ves devraient avoir besoin du palier 3.\n\nCe parcours continue vers l\u2019organigramme du palier trois.',
                recommendations: [
                    'Continuer vers l\u2019organigramme du palier trois.'
                ],
                actionButton: { text: 'D\u00e9marrer l\u2019organigramme du palier 3', action: 'startTier3Visual' }
            }
        }
    },
    tier3: {
        title: 'Palier TROIS\u00a0: Intervention personnalis\u00e9e',
        startNode: 'tier3-intro',
        nodes: {
            'tier3-intro': {
                id: 'tier3-intro',
                type: 'info',
                title: 'Information sur l\u2019entr\u00e9e',
                subtitle: 'Examinez les informations suivantes avant de continuer.',
                sections: [
                    {
                        title: 'Entr\u00e9e',
                        items: [
                            'Scores composites DIBELS en dessous du niveau de r\u00e9f\u00e9rence.',
                            'Minimum de deux p\u00e9riodes de 8 semaines d\u2019interventions du palier 2.',
                            'Progr\u00e8s minimes dans les interventions du palier 2, mesur\u00e9s par les \u00e9valuations DIBELS et le suivi des progr\u00e8s UFLI.',
                            'Diagnostic li\u00e9 \u00e0 la lecture (p.\u00a0ex.\u00a0: trouble d\u2019apprentissage sp\u00e9cifique en lecture, c.-\u00e0-d. dyslexie) OU inscrit sur la liste pour un diagnostic potentiel.'
                        ]
                    },
                    {
                        title: 'Information sur le groupe',
                        items: [
                            '1 \u00e0 3 \u00e9l\u00e8ves par groupe.',
                            'Intervention fournie par un enseignant form\u00e9 en litt\u00e9ratie structur\u00e9e et en administration d\u2019enseignement direct.',
                            'Les \u00e9l\u00e8ves travaillent vers des objectifs individualis\u00e9s (jusqu\u2019\u00e0 3) cr\u00e9\u00e9s par l\u2019enseignant d\u2019intervention et consign\u00e9s dans le plan sp\u00e9cifique \u00e0 l\u2019\u00e9l\u00e8ve.',
                            'Les \u00e9l\u00e8ves re\u00e7oivent un enseignement sp\u00e9cialis\u00e9 bas\u00e9 sur leurs objectifs sp\u00e9cifiques.',
                            'S\u00e9ances de 25 minutes, minimum 4 \u00e0 5 fois par semaine.',
                            'Les \u00e9l\u00e8ves dont les absences nuisent \u00e0 leur capacit\u00e9 \u00e0 recevoir 4 \u00e0 5 le\u00e7ons par semaine peuvent \u00eatre retir\u00e9s et replac\u00e9s dans une intervention du palier 2 \u00e0 la discr\u00e9tion de l\u2019administrateur.'
                        ]
                    },
                    {
                        title: 'Suivi des progr\u00e8s',
                        items: [
                            'Les interventions sont mises en \u0153uvre pour un minimum de 8 semaines.',
                            'Suivi des progr\u00e8s effectu\u00e9 chaque semaine.',
                            'Suivi universel des progr\u00e8s \u00e0 l\u2019\u00e9chelle de la division compl\u00e9t\u00e9 \u00e0 la 8e semaine.'
                        ]
                    },
                    {
                        title: 'Collaboration',
                        items: [
                            'Les parents sont inform\u00e9s par lettre que leur enfant recevra des interventions du palier 3.',
                            'Les membres de l\u2019\u00e9quipe partagent les r\u00e9sultats du suivi des progr\u00e8s lors des r\u00e9unions \u00e0 l\u2019\u00e9cole.',
                            'Les membres de l\u2019\u00e9quipe consultent et collaborent avec le psychologue scolaire, l\u2019orthophoniste et l\u2019ergoth\u00e9rapeute.'
                        ]
                    }
                ],
                nextNode: 'tier3-assessment',
                buttonText: 'J\u2019ai pris connaissance de ces informations'
            },
            'tier3-assessment': {
                id: 'tier3-assessment',
                type: 'selection',
                title: '\u00c9tape 1\u00a0: \u00c9valuation approfondie',
                subtitle: 'Administrer une \u00e9valuation approfondie.',
                description: 'Utilisez le menu ci-dessous pour trouver et administrer une \u00e9valuation approfondie correspondant aux besoins de vos \u00e9l\u00e8ves, tels que d\u00e9termin\u00e9s par le d\u00e9pistage en litt\u00e9ratie.',
                options: 'drillDownAssessments',
                nextNode: 'tier3-intervention',
                nextHandler: 'selectTier3AssessmentVisual'
            },
            'tier3-intervention': {
                id: 'tier3-intervention',
                type: 'selection',
                title: '\u00c9tape 2\u00a0: Intervention de 8 semaines',
                subtitle: 'S\u00e9lectionner et administrer une intervention de 8 semaines.',
                description: 'Utilisez le menu ci-dessous pour trouver une intervention appropri\u00e9e et l\u2019administrer pendant une p\u00e9riode de 8 semaines. Suivez hebdomadairement la r\u00e9ponse de l\u2019\u00e9l\u00e8ve \u00e0 l\u2019intervention.',
                options: 'interventions',
                nextNode: 'tier3-progress',
                nextHandler: 'selectTier3InterventionVisual'
            },
            'tier3-progress': {
                id: 'tier3-progress',
                type: 'decision',
                title: '\u00c9tape 3\u00a0: Suivi des progr\u00e8s',
                subtitle: 'L\u2019enseignement \u00e9tait-il efficace\u00a0?',
                description: 'Apr\u00e8s la p\u00e9riode de 8 semaines, administrer l\u2019outil de d\u00e9pistage de suivi des progr\u00e8s en litt\u00e9ratie planifi\u00e9 (DIBELS, CTOPP-2, THaFol, IDAPEL).\n\nSi vous avez choisi la mauvaise option, choisissez simplement la bonne et continuez.',
                choices: [
                    { id: 'improved', label: 'Enseignement efficace', sublabel: 'R\u00e9sultat du sous-test Bleu ou Vert', type: 'success', nextNode: 'tier3-success' },
                    { id: 'no-improvement', label: 'Enseignement inefficace', sublabel: 'R\u00e9sultat du sous-test Jaune ou Rouge', type: 'warning', nextNode: 'tier3-specialist' }
                ]
            },
            'tier3-success': {
                id: 'tier3-success',
                type: 'endpoint',
                status: 'success',
                title: '\u00c9tape 4\u00a0: Succ\u00e8s\u00a0!',
                description: 'Envisager de r\u00e9duire progressivement les soutiens au palier 1 et de surveiller.',
                recommendations: [
                    'Envisager de r\u00e9duire progressivement les soutiens au palier 1 et de surveiller.'
                ]
            },
            'tier3-specialist': {
                id: 'tier3-specialist',
                type: 'endpoint',
                status: 'warning',
                title: '\u00c9tape 4\u00a0: Rencontrer les cliniciens',
                description: 'Rencontrer les cliniciens appropri\u00e9s pour discuter des prochaines \u00e9tapes.'
            }
        }
    }
};

// ============================================
// French Node Summaries (used in journey animation)
// ============================================
const NODE_SUMMARIES_FR = {
    'tier1-principles': {
        text: 'Vous avez confirm\u00e9 que l\u2019enseignement en classe respecte les principes de l\u2019enseignement explicite et syst\u00e9matique\u00a0\u2014 les bases sont solides\u00a0! 📚',
        variant: 'step1'
    },
    'tier1-screener': {
        text: (choice) => `Vous avez administr\u00e9 ${choice || 'l\u2019outil de d\u00e9pistage en litt\u00e9ratie'} pour mesurer o\u00f9 en sont les \u00e9l\u00e8ves. Place aux donn\u00e9es\u00a0! 📊`,
        variant: 'selection'
    },
    'tier1-effectiveness': {
        effective:   { text: 'L\u2019outil de d\u00e9pistage indique Bleu ou Vert\u00a0\u2014 cet \u00e9l\u00e8ve est sur la bonne voie et l\u2019enseignement fonctionne\u00a0! 🎉', variant: 'effective' },
        ineffective: { text: 'L\u2019outil de d\u00e9pistage indique Jaune ou Rouge\u00a0\u2014 l\u2019enseignement doit \u00eatre ajust\u00e9 pour cet \u00e9l\u00e8ve. 📋', variant: 'ineffective' }
    },
    'tier1-percentage': {
        'more-20':   { text: 'Plus de 20\u00a0% des \u00e9l\u00e8ves ne sont pas au niveau de r\u00e9f\u00e9rence\u00a0\u2014 cela pointe vers un \u00e9cart d\u2019enseignement \u00e0 l\u2019\u00e9chelle de la classe. Il est temps d\u2019explorer les soutiens du palier 2\u00a0! 📊', variant: 'ineffective' },
        'less-20':   { text: 'Moins de 20\u00a0% des \u00e9l\u00e8ves ont besoin d\u2019aide suppl\u00e9mentaire\u00a0\u2014 un r\u00e9enseignement cibl\u00e9 pour un petit groupe est la prochaine \u00e9tape\u00a0! 🔄', variant: 'ineffective' }
    },
    'tier2-principles': {
        text: 'Vous avez \u00e9cart\u00e9 les d\u00e9ficiences visuelles, auditives, les absences, la langue et d\u2019autres obstacles\u00a0\u2014 l\u2019\u00e9l\u00e8ve est pr\u00eat pour une intervention cibl\u00e9e au palier 2\u00a0! ✅',
        variant: 'step1'
    },
    'tier2-assessment': {
        text: (choice) => `Vous avez s\u00e9lectionn\u00e9 ${choice || 'une \u00e9valuation approfondie'} pour cibler pr\u00e9cis\u00e9ment les comp\u00e9tences en litt\u00e9ratie qui ont le plus besoin de soutien. 🔍`,
        variant: 'selection'
    },
    'tier2-intervention': {
        text: (choice) => `Vous avez choisi ${choice || 'un programme d\u2019intervention'} pour le cycle d\u2019intervention de 8 semaines\u00a0\u2014 le travail intensif en petit groupe commence\u00a0! 💪`,
        variant: 'selection'
    },
    'tier2-progress': {
        effective:        { text: 'Apr\u00e8s le cycle de 8 semaines, le d\u00e9pistage indique Bleu ou Vert\u00a0\u2014 l\u2019intervention a fonctionn\u00e9\u00a0! Quel beau r\u00e9sultat\u00a0! 🌟', variant: 'effective' },
        'no-improvement': { text: 'Apr\u00e8s 8 semaines, les r\u00e9sultats indiquent encore Jaune ou Rouge\u00a0\u2014 l\u2019\u00e9l\u00e8ve a besoin d\u2019un autre cycle avant de r\u00e9\u00e9valuer. 📋', variant: 'ineffective' }
    },
    'tier2-cycle2-assessment': {
        text: (choice) => `Vous avez s\u00e9lectionn\u00e9 ${choice || 'une \u00e9valuation approfondie'} pour le deuxi\u00e8me cycle\u00a0\u2014 obtenons un portrait encore plus pr\u00e9cis. 🔍`,
        variant: 'selection'
    },
    'tier2-cycle2-intervention': {
        text: (choice) => `Vous avez choisi ${choice || 'un programme d\u2019intervention'} pour le deuxi\u00e8me cycle de 8 semaines\u00a0\u2014 ajust\u00e9 et pr\u00eat\u00a0! 💪`,
        variant: 'selection'
    },
    'tier2-cycle2-progress': {
        effective:        { text: 'Le deuxi\u00e8me cycle d\u2019intervention a port\u00e9 ses fruits\u00a0\u2014 les r\u00e9sultats de l\u2019\u00e9l\u00e8ve sont maintenant Bleu ou Vert\u00a0! Il est temps d\u2019envisager un retour au palier 1. 🎉', variant: 'effective' },
        'no-improvement': { text: 'Apr\u00e8s deux cycles complets, l\u2019\u00e9l\u00e8ve a besoin d\u2019un soutien plus intensif et personnalis\u00e9\u00a0\u2014 on passe au palier 3. 📋', variant: 'ineffective' }
    },
    'tier3-intro': {
        text: 'Vous avez examin\u00e9 les crit\u00e8res d\u2019entr\u00e9e du palier 3 et confirm\u00e9 que cet \u00e9l\u00e8ve r\u00e9pond aux exigences d\u2019une intervention intensive et personnalis\u00e9e. 📋',
        variant: 'step1'
    },
    'tier3-assessment': {
        text: (choice) => `Vous avez s\u00e9lectionn\u00e9 ${choice || 'une \u00e9valuation approfondie'} pour guider le plan d\u2019intervention individualis\u00e9 du palier 3. 🔍`,
        variant: 'selection'
    },
    'tier3-intervention': {
        text: (choice) => `Vous avez choisi ${choice || 'un programme d\u2019intervention intensif'} pour des s\u00e9ances personnalis\u00e9es en petit groupe au palier 3\u00a0\u2014 chaque minute compte\u00a0! 💪`,
        variant: 'selection'
    },
    'tier3-progress': {
        effective:        { text: 'Les interventions du palier 3 font vraiment la diff\u00e9rence\u00a0\u2014 les r\u00e9sultats de l\u2019\u00e9l\u00e8ve sont maintenant Bleu ou Vert\u00a0! Discutons des prochaines \u00e9tapes. 🌟', variant: 'effective' },
        'no-improvement': { text: 'L\u2019\u00e9l\u00e8ve a besoin d\u2019un soutien continu au palier 3 et d\u2019un examen plus approfondi avec des sp\u00e9cialistes. L\u2019\u00e9quipe est l\u00e0 pour lui\u00a0! 📋', variant: 'ineffective' }
    }
};
