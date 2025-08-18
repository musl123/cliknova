import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Play,
  Users,
  Clock,
  Star
} from 'lucide-react';

interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  duracao_total: number;
  nivel: string;
  certificado: boolean;
  data_criacao: string;
  produto: {
    id: string;
    titulo: string;
    preco: number;
    ativo: boolean;
    total_vendas: number;
    avaliacao_media: number;
  };
}

export default function CourseManagement() {
  const { user } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  useEffect(() => {
    if (user) {
      carregarCursos();
    }
  }, [user]);

  const carregarCursos = async () => {
    try {
      const { data, error } = await supabase
        .from('cursos')
        .select(`
          *,
          produto:produtos(
            id,
            titulo,
            preco,
            ativo,
            total_vendas,
            avaliacao_media
          )
        `)
        .eq('produtos.produtor_id', user?.id)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao carregar cursos:', error);
      } else if (data) {
        setCursos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCursos = cursos.filter(curso => {
    const matchesSearch = curso.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'todos' || 
      (filterStatus === 'ativo' && curso.produto?.ativo) ||
      (filterStatus === 'inativo' && !curso.produto?.ativo);
    
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
              <h1 className="text-2xl font-bold text-gray-900">Gestão de Cursos</h1>
              <p className="text-gray-600">Crie e gira os seus cursos online</p>
            </div>
            <Link
              to="/produtor/curso/novo"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Curso
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option value="ativo">Cursos ativos</option>
              <option value="inativo">Cursos inativos</option>
            </select>

            <div className="flex items-center text-sm text-gray-600">
              <Filter className="w-4 h-4 mr-2" />
              {filteredCursos.length} curso{filteredCursos.length !== 1 ? 's' : ''} encontrado{filteredCursos.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Lista de Cursos */}
        {filteredCursos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {cursos.length === 0 ? 'Nenhum curso criado' : 'Nenhum curso encontrado'}
            </h3>
            <p className="text-gray-600 mb-6">
              {cursos.length === 0 
                ? 'Comece a criar o seu primeiro curso online e partilhe o seu conhecimento.'
                : 'Tente ajustar os filtros de pesquisa.'
              }
            </p>
            {cursos.length === 0 && (
              <Link
                to="/produtor/curso/novo"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Primeiro Curso
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCursos.map((curso) => (
              <div key={curso.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{curso.titulo}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      curso.produto?.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {curso.produto?.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{curso.descricao}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{Math.floor(curso.duracao_total / 60)}h {curso.duracao_total % 60}min</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{curso.produto?.total_vendas || 0} alunos</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" />
                      <span>{curso.produto?.avaliacao_media?.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="font-medium text-blue-600">
                      €{curso.produto?.preco || 0}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/produtor/curso/${curso.id}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                    >
                      Gerir Curso
                    </Link>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}