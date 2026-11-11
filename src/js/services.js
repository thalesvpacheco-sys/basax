/**
 * Conteúdo das páginas de serviço.
 * Cada serviço vira uma página estática no build (vite.config.js), no endereço `path`
 * (os mesmos endereços do site antigo em WordPress, para manter o posicionamento no Google).
 * `seoTitle` e `description` alimentam o <title>, a meta description e as tags de compartilhamento.
 * Para editar textos de um serviço, altere apenas este arquivo.
 */
export const SERVICES = {
  "condominios": {
    "path": "/servicos/condominio/",
    "seoTitle": "Reforma de condomínios em Goiânia",
    "description": "Reforma de fachadas, recuperação estrutural, impermeabilização e áreas comuns de condomínios em Goiânia, com relatórios para o síndico e parcelamento direto.",
    "title": "Reformas de condomínios",
    "icon": "condominio",
    "intro": "Experiência em condomínios residenciais e comerciais: da manutenção estrutural preventiva à modernização de fachadas e áreas de lazer, com previsibilidade para o caixa do prédio.",
    "items": [
      "Reforma e modernização de fachadas: pastilhas, pintura, texturas e pele de vidro",
      "Recuperação estrutural de vigas, pilares e garagens",
      "Impermeabilização de lajes, subsolos e piscinas",
      "Revitalização de portarias e áreas de lazer"
    ],
    "diff": [
      [
        "Logística e segurança",
        "Áreas isoladas, controle de acesso dos operários e limpeza constante."
      ],
      [
        "Ruído sob controle",
        "Atividades barulhentas concentradas nos horários permitidos pelo regimento."
      ],
      [
        "Previsibilidade financeira",
        "Condições flexíveis e parcelamento direto para facilitar a aprovação."
      ],
      [
        "Apoio ao síndico",
        "Relatórios e cronogramas para prestação de contas em assembleia."
      ]
    ]
  },
  "retrofit": {
    "path": "/pintura-predial/",
    "seoTitle": "Retrofit e pintura de fachadas prediais em Goiânia",
    "description": "Retrofit de fachadas e pintura predial em Goiânia: tratamento de fissuras e infiltrações, texturas, pastilhas, ACM e pele de vidro, conforme as normas técnicas.",
    "title": "Retrofit de fachadas",
    "icon": "retrofit",
    "intro": "Mais do que pintura: o retrofit renova a estética, aumenta a eficiência e valoriza o imóvel — com diagnóstico completo antes do novo acabamento.",
    "items": [
      "Diagnóstico e tratamento de fissuras, infiltrações e descolamento de pastilhas ou reboco",
      "Texturas de alta durabilidade, cerâmicas e pastilhas",
      "Revestimentos em ACM e pele de vidro",
      "Execução conforme as normas técnicas vigentes"
    ],
    "diff": [
      [
        "Valorização patrimonial",
        "Atualização estética e tecnológica que valoriza as unidades."
      ],
      [
        "Eficiência",
        "Materiais que melhoram o isolamento térmico e acústico."
      ],
      [
        "Segurança estrutural",
        "Patologias tratadas na origem, antes do acabamento."
      ],
      [
        "Logística planejada",
        "Balancins, fixações e proteções para circulação segura."
      ]
    ]
  },
  "administracao": {
    "path": "/servicos/adm/",
    "seoTitle": "Obra por administração em Goiânia",
    "description": "Obra por administração em Goiânia: você paga o custo real de materiais e mão de obra e a Basax faz a gestão técnica por uma taxa fixa, com total transparência.",
    "title": "Obra por administração",
    "icon": "adm",
    "intro": "Você paga diretamente o custo real de materiais e mão de obra. A Basax assume a responsabilidade técnica, a gestão e a execução por uma taxa de administração fixa — sem margens de contingência embutidas.",
    "items": [
      "Planejamento e cronograma da obra",
      "Cotação e compra de materiais",
      "Coordenação da mão de obra e segurança do trabalho",
      "Fiscalização técnica de normas, qualidade e prazos"
    ],
    "diff": [
      [
        "Transparência",
        "Compras, contratações e notas fiscais apresentadas de forma organizada."
      ],
      [
        "Poder de negociação",
        "Descontos e condições com fornecedores repassados a você."
      ],
      [
        "Flexibilidade",
        "Ajuste de acabamentos ou escopo durante a obra, sem multas abusivas."
      ],
      [
        "Você no controle",
        "O controle financeiro e as decisões estratégicas ficam com você."
      ]
    ]
  },
  "comerciais": {
    "path": "/servicos/comercial/",
    "seoTitle": "Obras e reformas comerciais em Goiânia",
    "description": "Construção e reforma de lojas, sedes corporativas e espaços comerciais em Goiânia, com cronograma rigoroso e instalações compatibilizadas.",
    "title": "Obras comerciais",
    "icon": "comercial",
    "intro": "Construção e reforma de espaços comerciais e corporativos, do projeto à entrega, fiéis ao projeto aprovado pelo cliente.",
    "items": [
      "Novas sedes corporativas",
      "Lojas e estabelecimentos comerciais",
      "Modernização de espaços existentes",
      "Instalações elétricas, hidráulicas, de climatização, dados e segurança"
    ],
    "diff": [
      [
        "Prazo",
        "Cronogramas assertivos e gerenciamento rigoroso da obra."
      ],
      [
        "Engenharia de valor",
        "Recursos otimizados, sem desperdícios nem surpresas."
      ],
      [
        "Durabilidade",
        "Materiais e técnicas para alto fluxo de pessoas."
      ],
      [
        "Compatibilização",
        "Instalações coordenadas para o espaço funcionar desde o primeiro dia."
      ]
    ]
  },
  "industriais": {
    "path": "/servicos/industrial/",
    "seoTitle": "Obras industriais em Goiânia",
    "description": "Construção e reforma de instalações industriais em Goiânia, do projeto à entrega das chaves, com prazo e orçamento definidos em contrato.",
    "title": "Obras industriais",
    "icon": "industrial",
    "intro": "Construção e reforma de instalações industriais, com a Basax responsável por todo o escopo: do projeto à entrega das chaves.",
    "items": [
      "Projeto detalhado conforme os objetivos da operação",
      "Construção de novas instalações industriais",
      "Reforma de instalações existentes",
      "Apoio nos trâmites com órgãos públicos"
    ],
    "diff": [
      [
        "Prazo contratado",
        "Entrega dentro do cronograma acordado."
      ],
      [
        "Orçamento definido",
        "Cumprimento do orçamento estabelecido previamente."
      ],
      [
        "Menos desperdício",
        "Planejamento que reduz perdas de material."
      ],
      [
        "Equipe qualificada",
        "Profissionais experientes no canteiro."
      ]
    ]
  },
  "residenciais": {
    "path": "/servicos/residencial/",
    "seoTitle": "Construção e reforma residencial em Goiânia",
    "description": "Construção de casas de médio e alto padrão e reforma de casas e apartamentos em Goiânia, da infraestrutura ao acabamento, fiel ao projeto.",
    "title": "Obras residenciais",
    "icon": "residencial",
    "intro": "Construção de residências de médio e alto padrão e reformas de casas e apartamentos — da infraestrutura ao acabamento, com fidelidade ao projeto arquitetônico.",
    "items": [
      "Construção de casas",
      "Reformas de casas e apartamentos",
      "Gestão e compatibilização de alvenaria, instalações, revestimentos e marcenaria"
    ],
    "diff": [
      [
        "Técnica e detalhe",
        "Rigor de engenharia com atenção ao acabamento."
      ],
      [
        "Prazo e orçamento",
        "Compromisso com o que foi combinado."
      ],
      [
        "Sem surpresas",
        "Obra segura, organizada e previsível."
      ],
      [
        "Solidez",
        "Responsabilidade estrutural com o seu patrimônio."
      ]
    ]
  }
};
