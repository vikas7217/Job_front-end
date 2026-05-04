import React, { useState } from 'react';

interface ProfileCardProps {
  name: string;
  title: string;
  experience: string;
  company: string;
  education?: string;
  skills: string[];
  description: string;
  profileImage: string;
  isVerified: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  title,
  experience,
  company,
  education,
  skills,
  description,
  profileImage,
  isVerified
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-start space-x-4 mb-4">
        {/* Profile Image */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {profileImage ? (
            <img src={profileImage} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            name.charAt(0)
          )}
        </div>
        
        {/* Name and Verification */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">{name}</h3>
            {isVerified && (
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.934.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C17.138 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" />
            </svg>
          </div>
          
          {/* Title and Experience */}
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span className="font-medium">{title}</span>
            <span className="mx-2">|</span>
            <span>Exp. {experience}</span>
          </div>
          
          {/* Company and Education Badges */}
          <div className="flex space-x-2 mb-3">
            <span className="bg-black text-white text-xs px-3 py-1 rounded-full font-medium">
              {company}
            </span>
            {education && (
              <span className="bg-black text-white text-xs px-3 py-1 rounded-full font-medium">
                {education}
              </span>
            )}
          </div>
          
          {/* Profile Button */}
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg transition-colors duration-200 text-sm flex items-center space-x-1">
            <span>Profile</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.slice(0, 6).map((skill, index) => (
            <span key={index} className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
              {skill}
            </span>
          ))}
        </div>
        {skills.length > 6 && (
          <button className="text-blue-600 text-sm hover:underline">
            View all ({skills.length})
          </button>
        )}
      </div>
      
      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const ProfessionalProfiles: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Software Engineers');

  const categories = [
    { name: 'Software Engineers', noc: 'NOC 2151' },
    { name: 'Software Developer', noc: 'NOC 2174' },
    { name: 'Web Designer', noc: 'NOC 2175' },
    { name: 'AI Engineers', noc: 'NOC 2171' },
    { name: 'ML Engineers', noc: 'NOC 2171' },
    { name: 'Data Engineers', noc: 'NOC 2172' },
    { name: 'DevOps', noc: 'NOC 2173' },
    { name: 'Solutions Architect', noc: 'NOC 2174' },
    { name: 'QA Engineer', noc: 'NOC 2175' },
  ];

  const profilesData = {
    'Software Engineers': [
      {
        name: 'Rahul Purohit',
        title: 'Staff Software Engineer',
        experience: '10 years',
        company: 'Uber',
        education: 'IIT Kanpur',
        skills: ['JavaScript', 'Java', 'Python', 'SQL', 'C', 'Spring', 'C++', 'AngularJs'],
        description: 'Skilled in Java, Python, JavaScript, SQL, C++, Spring, and AngularJS, I specialize in building scalable backend systems, optimizing resource usage (compute, storage, network), and designing large-scale data pipelines. I bring strong fundamentals in',
        profileImage: '',
        isVerified: true,
      },
      {
        name: 'Priya Sharma',
        title: 'Senior Software Engineer',
        experience: '8 years',
        company: 'Microsoft',
        education: 'BITS Pilani',
        skills: ['C#', '.NET', 'Azure', 'SQL Server', 'React', 'TypeScript', 'Docker'],
        description: 'Experienced full-stack developer with expertise in Microsoft technologies. Passionate about cloud-native applications and microservices architecture. Strong background in enterprise software development.',
        profileImage: '',
        isVerified: true,
      },
      {
        name: 'Arjun Mehta',
        title: 'Software Engineer',
        experience: '5 years',
        company: 'Amazon',
        education: 'IIT Delhi',
        skills: ['Java', 'AWS', 'DynamoDB', 'Spring Boot', 'React', 'TypeScript'],
        description: 'Backend specialist with deep knowledge of AWS services and distributed systems. Experience in building high-performance, scalable applications for millions of users.',
        profileImage: '',
        isVerified: true,
      },
      {
        name: 'Neha Patel',
        title: 'Full Stack Developer',
        experience: '6 years',
        company: 'Atlassian',
        education: 'NIT Surathkal',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Docker', 'Kubernetes'],
        description: 'Versatile developer with expertise in modern web technologies. Passionate about creating intuitive user experiences and robust backend systems.',
        profileImage: '',
        isVerified: true,
      },
    ],
    'AI Engineers': [
      {
        name: 'Dr. Amit Kumar',
        title: 'Senior AI Engineer',
        experience: '12 years',
        company: 'Google',
        education: 'IIT Bombay',
        skills: ['TensorFlow', 'PyTorch', 'Python', 'CUDA', 'NLP', 'Computer Vision'],
        description: 'PhD in Computer Science with specialization in machine learning. Led multiple AI initiatives at Google, including natural language processing and computer vision projects.',
        profileImage: '',
        isVerified: true,
      },
      {
        name: 'Sneha Reddy',
        title: 'AI Research Engineer',
        experience: '7 years',
        company: 'OpenAI',
        education: 'Stanford University',
        skills: ['PyTorch', 'Transformers', 'NLP', 'Python', 'AWS', 'Docker'],
        description: 'Research engineer focused on large language models and natural language processing. Contributed to several breakthrough AI models and publications.',
        profileImage: '',
        isVerified: true,
      },
      {
        name: 'Vikram Singh',
        title: 'Machine Learning Engineer',
        experience: '9 years',
        company: 'Netflix',
        education: 'IIT Madras',
        skills: ['Scikit-learn', 'Python', 'Spark', 'Kafka', 'Docker', 'Kubernetes'],
        description: 'ML engineer specializing in recommendation systems and personalization algorithms. Experience in building production ML pipelines at scale.',
        profileImage: '',
        isVerified: true,
      },
      {
        name: 'Anjali Desai',
        title: 'AI Product Engineer',
        experience: '6 years',
        company: 'Meta',
        education: 'BITS Goa',
        skills: ['PyTorch', 'React', 'Python', 'JavaScript', 'AWS', 'GraphQL'],
        description: 'Product-focused AI engineer with expertise in deploying ML models in production. Strong background in both research and engineering.',
        profileImage: '',
        isVerified: true,
      },
    ],
    'ML Engineers': [
      {
        name: 'Rajesh Verma',
        title: 'Principal ML Engineer',
        experience: '15 years',
        company: 'Apple',
        education: 'IIT Kanpur',
        skills: ['Core ML', 'Python', 'TensorFlow', 'iOS', 'Swift', 'Computer Vision'],
        description: 'Leading ML initiatives at Apple with focus on on-device machine learning. Expert in Core ML framework and mobile AI applications.',
        profileImage: '',
        isVerified: true,
      },
      {
        name: 'Kavya Iyer',
        title: 'ML Platform Engineer',
        experience: '8 years',
        company: 'Uber',
        education: 'IIT Delhi',
        skills: ['Kubernetes', 'Python', 'TensorFlow', 'Airflow', 'Docker', 'AWS'],
        description: 'Platform engineer specializing in ML infrastructure and MLOps. Experience in building scalable ML platforms for thousands of models.',
        profileImage: '',
        isVerified: true,
      },
    ],
    'Data Engineers': [
      {
        name: 'Suresh Kumar',
        title: 'Senior Data Engineer',
        experience: '11 years',
        company: 'LinkedIn',
        education: 'IIT Roorkee',
        skills: ['Spark', 'Kafka', 'Hadoop', 'Python', 'SQL', 'Airflow'],
        description: 'Data engineering expert with deep knowledge of big data technologies. Built data pipelines processing petabytes of data daily.',
        profileImage: '',
        isVerified: true,
      },
      {
        name: 'Divya Sharma',
        title: 'Data Platform Engineer',
        experience: '7 years',
        company: 'Twitter',
        education: 'NIT Trichy',
        skills: ['Snowflake', 'dbt', 'Python', 'Airflow', 'Docker', 'AWS'],
        description: 'Modern data stack specialist with expertise in cloud data warehouses and data transformation tools.',
        profileImage: '',
        isVerified: true,
      },
    ],
    'DevOps': [
      {
        name: 'Mohan Das',
        title: 'DevOps Engineer',
        experience: '9 years',
        company: 'Netflix',
        education: 'IIT Guwahati',
        skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'Jenkins', 'Python'],
        description: 'DevOps specialist with expertise in cloud infrastructure and CI/CD pipelines. Experience in managing large-scale distributed systems.',
        profileImage: '',
        isVerified: true,
      },
      {
        name: 'Pooja Gupta',
        title: 'Site Reliability Engineer',
        experience: '6 years',
        company: 'Google',
        education: 'BITS Pilani',
        skills: ['Go', 'Kubernetes', 'Prometheus', 'Grafana', 'Python', 'Linux'],
        description: 'SRE focused on building reliable, scalable systems. Expert in monitoring, alerting, and incident response.',
        profileImage: '',
        isVerified: true,
      },
    ],
    'Solutions Architect': [
      {
        name: 'Ravi Teja',
        title: 'Senior Solutions Architect',
        experience: '14 years',
        company: 'AWS',
        education: 'IIT Bombay',
        skills: ['AWS', 'Azure', 'GCP', 'Terraform', 'Docker', 'Kubernetes'],
        description: 'Cloud architecture expert with deep knowledge of AWS services. Helped hundreds of enterprises migrate to cloud.',
        profileImage: '',
        isVerified: true,
      },
      {
        name: 'Anita Rao',
        title: 'Enterprise Architect',
        experience: '12 years',
        company: 'Microsoft',
        education: 'IIT Delhi',
        skills: ['Azure', '.NET', 'Microservices', 'Docker', 'Kubernetes', 'DevOps'],
        description: 'Enterprise architecture specialist with focus on digital transformation and cloud migration strategies.',
        profileImage: '',
        isVerified: true,
      },
    ],
    'QA Engineer': [
      {
        name: 'Sanjay Patel',
        title: 'Senior QA Engineer',
        experience: '8 years',
        company: 'Adobe',
        education: 'NIT Warangal',
        skills: ['Selenium', 'Appium', 'Java', 'Python', 'Jenkins', 'JIRA'],
        description: 'QA automation expert with experience in both web and mobile testing. Strong background in test automation frameworks.',
        profileImage: '',
        isVerified: true,
      },
      {
        name: 'Meera Krishnan',
        title: 'Test Automation Engineer',
        experience: '6 years',
        company: 'Salesforce',
        education: 'BITS Hyderabad',
        skills: ['Cypress', 'JavaScript', 'Python', 'Selenium', 'Docker', 'Jenkins'],
        description: 'Modern testing specialist with expertise in Cypress and JavaScript-based test automation.',
        profileImage: '',
        isVerified: true,
      },
    ],
  };

  const currentProfiles = profilesData[activeCategory as keyof typeof profilesData] || [];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Discover Top Engineering Talent
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse through our curated selection of verified professionals across different engineering disciplines
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === category.name
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold">{category.name}</div>
                  <div className="text-xs opacity-75">{category.noc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {currentProfiles.map((profile, index) => (
            <ProfileCard key={index} {...profile} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfessionalProfiles; 