import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-blue-400 mb-4">ClikeNOVA</div>
            <p className="text-gray-300 mb-4">
              A plataforma líder em produtos digitais, e-books e cursos online. 
              Crie, venda e aprenda num só lugar.
            </p>
            <div className="text-sm text-gray-400">
              © 2025 ClikeNOVA. Todos os direitos reservados.
            </div>
          </div>

          {/* Links úteis */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/sobre" className="hover:text-blue-400 transition-colors">Sobre Nós</Link></li>
              <li><Link to="/contacto" className="hover:text-blue-400 transition-colors">Contacto</Link></li>
              <li><Link to="/ajuda" className="hover:text-blue-400 transition-colors">Centro de Ajuda</Link></li>
              <li><Link to="/termos" className="hover:text-blue-400 transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>

          {/* Para Criadores */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Para Criadores</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/registo" className="hover:text-blue-400 transition-colors">Criar Conta</Link></li>
              <li><Link to="/produtor" className="hover:text-blue-400 transition-colors">Vender Cursos</Link></li>
              <li><Link to="/afiliado" className="hover:text-blue-400 transition-colors">Programa de Afiliados</Link></li>
              <li><Link to="/comissoes" className="hover:text-blue-400 transition-colors">Comissões</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>Feito com ❤️ em Portugal | Moeda: EUR (€)</p>
        </div>
      </div>
    </footer>
  );
}