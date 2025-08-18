import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Award, 
  TrendingUp, 
  Download,
  Star,
  User,
  Settings,
  Bell,
  LogOut,
  Search,
  Filter,
  Calendar,
  BarChart3
} from 'lucide-react';

interface CursoComprado {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url?: string;
  progresso: number;
  data_compra: string;
  produto: {
    id: string;
    titulo: string;
    preco: number;
    avaliacao_media: number;
  };
  curso: {
    id: string;
    duracao_total: number;
    certificado: boolean;
  };
}

interface EstudanteStats {
  cursosComprados: number;
  cursosCompletos: number;
  horasEstudadas: number;
  certificados: number;
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [cursos, setCursos] = useState<CursoComprado[]>([]);
  const [stats, setStats] = useState<EstudanteStats>({
    cursosComprados: 0,
    cursosCompletos: 0,
    horasEstudadas: 0,
    certificados: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user]);

  const carregarDados = async () => {
    try {
      // Carregar cursos comprados pelo aluno
      const { data: comprasData, error: comprasError } = await supabase
        .from('compras')
        .select(`
          *,
          produto:produtos(
            id,
            titulo,
            preco,
            avaliacao_media,
            imagem_url
          ),
          curso:cursos(
            id,
            duracao_total,
            certificado
          )
        `)
        .eq('utilizador_id', user?.id)
        .eq('status_pagamento', 'pago')
        .order('data_compra', { ascending: false });

      if (comprasError) {
        console.error('Erro ao carregar compras:', comprasError);
      } else if (comprasData) {
        // Simular progresso dos cursos (em produção viria da tabela progresso_cursos)
        const cursosComProgresso = comprasData.map(compra => ({
          id: compra.id,
          titulo: compra.produto?.titulo || 'Curso sem título',
          descricao: 'Descrição do curso',
          imagem_url: compra.produto?.imagem_url,
          progresso: Math.floor(Math.random() * 100), // Simulado
          data_compra: compra.data_compra,
          produto: compra.produto,
          curso: compra.curso
        }));

        setCursos(cursosComProgresso);

        // Calcular estatísticas
        const cursosCompletos = cursosComProgresso.filter(c => c.progresso === 100).length;
        const horasEstudadas = cursosComProgresso.reduce((total, curso) => {
          return total + (curso.curso?.duracao_total || 0) * (curso.progresso / 100);
        }, 0);
        const certificados = cursosComProgresso.filter(c => c.progresso === 100 && c.curso?.certificado).length;

        setStats({
          cursosComprados: cursosComProgresso.length,
          cursosCompletos,
          horasEstudadas: Math.floor(horasEstudadas / 60), // Converter para horas
          certificados
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCursos = cursos.filter(curso => {
    const matchesSearch = curso.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'todos' || 
      (filterStatus === 'em-progresso' && curso.progresso > 0 && curso.progresso < 100) ||
      (filterStatus === 'completos' && curso.progresso === 100) ||
      (filterStatus === 'nao-iniciados' && curso.progresso === 0);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard do Aluno</h1>
              <p className="text-gray-600">Bem-vindo de volta, {user?.nome}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
              <button 
                onClick={logout}
                className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cursos Comprados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cursosComprados}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cursos Completos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cursosCompletos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Horas Estudadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.horasEstudadas}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.certificados}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Meus Cursos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Os Meus Cursos</h2>
                  <Link
                    to="/loja"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Explorar mais cursos
                  </Link>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Pesquisar cursos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="todos">Todos os cursos</option>
                    <option value="em-progresso">Em progresso</option>
                    <option value="completos">Completos</option>
                    <option value="nao-iniciados">Não iniciados</option>
                  </select>
                </div>
              </div>

              <div className="p-6">
                {filteredCursos.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {cursos.length === 0 ? 'Nenhum curso comprado' : 'Nenhum curso encontrado'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {cursos.length === 0 
                        ? 'Explore a nossa loja e comece a aprender hoje!'
                        : 'Tente ajustar os filtros de pesquisa.'
                      }
                    </p>
                    {cursos.length === 0 && (
                      <Link
                        to="/loja"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Explorar Cursos
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCursos.map((curso) => (
                      <div key={curso.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{curso.titulo}</h3>
                            <p className="text-sm text-gray-600 mb-2">{curso.descricao}</p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{Math.floor((curso.curso?.duracao_total || 0) / 60)}h</span>
                              </div>
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                <span>{curso.produto?.avaliacao_media?.toFixed(1) || '0.0'}</span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span>Comprado em {new Date(curso.data_compra).toLocaleDateString('pt-PT')}</span>
                              </div>
                            </div>

                            {/* Barra de Progresso */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-600">Progresso</span>
                                <span className="font-medium text-gray-900">{curso.progresso}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${curso.progresso}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/aluno/curso/${curso.curso?.id}`}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                {curso.progresso === 0 ? 'Começar' : 'Continuar'}
                              </Link>
                              
                              {curso.progresso === 100 && curso.curso?.certificado && (
                                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center">
                                  <Download className="w-4 h-4 mr-2" />
                                  Certificado
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ações Rápidas */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="space-y-3">
                <Link
                  to="/loja"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BookOpen className="w-5 h-5 mr-3 text-blue-600" />
                  Explorar Cursos
                </Link>
                <Link
                  to="/aluno/certificados"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Award className="w-5 h-5 mr-3 text-green-600" />
                  Meus Certificados
                </Link>
                <Link
                  to="/aluno/progresso"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5 mr-3 text-purple-600" />
                  Relatório de Progresso
                </Link>
                <Link
                  to="/aluno/perfil"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 mr-3 text-gray-600" />
                  Editar Perfil
                </Link>
              </div>
            </div>

            {/* Progresso Geral */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Progresso Geral</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Cursos Completos</span>
                    <span className="font-medium">{stats.cursosCompletos}/{stats.cursosComprados}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${stats.cursosComprados > 0 ? (stats.cursosCompletos / stats.cursosComprados) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{stats.horasEstudadas}h</div>
                    <div className="text-sm text-gray-600">Total de horas estudadas</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Suporte */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">Precisa de ajuda?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Consulte o nosso centro de ajuda ou contacte o suporte.
              </p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                Centro de Ajuda
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}