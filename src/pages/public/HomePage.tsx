import React from 'react';
import { Link } from 'react-router-dom';
import { Play, BookOpen, Users, TrendingUp, Star, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = [
    {
      id: 1,
      title: 'Curso Completo de Marketing Digital',
      description: 'Aprenda as estratégias mais eficazes de marketing digital com especialistas da área.',
      price: '€97',
      rating: 4.8,
      students: 1250,
      image: 'https://images.pexels.com/photos/7414294/pexels-photo-7414294.jpeg?auto=compress&cs=tinysrgb&w=500'
    },
    {
      id: 2,
      title: 'E-book: Gestão Financeira Pessoal',
      description: 'Guia completo para organizar as suas finanças e investir com inteligência.',
      price: '€29',
      rating: 4.9,
      students: 890,
      image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=500'
    },
    {
      id: 3,
      title: 'Programação Web Moderna',
      description: 'Domine React, Node.js e as tecnologias mais procuradas no mercado.',
      price: '€149',
      rating: 4.7,
      students: 2100,
      image: 'https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg?auto=compress&cs=tinysrgb&w=500'
    }
  ];

  const stats = [
    { icon: Users, label: 'Alunos ativos', value: '50K+' },
    { icon: BookOpen, label: 'Cursos disponíveis', value: '500+' },
    { icon: Play, label: 'Horas de conteúdo', value: '10K+' },
    { icon: TrendingUp, label: 'Taxa de satisfação', value: '98%' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Transforme o seu
                <span className="block text-yellow-300">conhecimento em sucesso</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                A plataforma líder para criar, vender e aprender com cursos online, e-books e produtos digitais.
                Junte-se a milhares de criadores e alunos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/registo" 
                  className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 transition-colors inline-flex items-center justify-center"
                >
                  Começar gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link 
                  to="/loja" 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                >
                  Explorar cursos
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Pessoa a estudar online" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-900 font-medium">+500 novos alunos hoje</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cursos mais populares
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra os conteúdos mais procurados pelos nossos alunos e comece a sua jornada de aprendizagem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-video">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700 ml-1">{product.rating}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{product.students} alunos</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-600">{product.price}</div>
                    <Link 
                      to={`/produto/${product.id}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Ver curso
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/loja" 
              className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Ver todos os cursos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para começar a sua jornada?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de pessoas que já transformaram as suas vidas com os nossos cursos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/registo" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Começar agora
            </Link>
            <Link 
              to="/loja" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Ver cursos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}