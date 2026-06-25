import React, { useState } from 'react';
import { Book, AccessUser } from '../types';
import { Search, BookOpen, Download, ExternalLink, Shield, Lock, Unlock, Eye, ListFilter } from 'lucide-react';

interface LibraryViewProps {
  books: Book[];
  currentUser: AccessUser | null;
  isAdmin: boolean;
}

export default function LibraryView({ books, currentUser, isAdmin }: LibraryViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Todos os livros');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name-az' | 'name-za' | 'grau-asc' | 'grau-desc'>('name-az');
  const [checkedCategories, setCheckedCategories] = useState<Record<string, boolean>>({});
  const [checkedDegrees, setCheckedDegrees] = useState<Record<number, boolean>>({});

  // 1. Get user access level
  const userLevel = currentUser 
    ? parseInt(String(currentUser.nivelAcesso || (isAdmin ? '33' : '1')), 10) 
    : 1;

  // Helper for degree labels
  const getDegreeLabel = (level: number) => {
    switch (level) {
      case 1:
        return 'Grau 1 - Aprendiz';
      case 2:
        return 'Grau 2 - Companheiro';
      case 3:
        return 'Grau 3 - Mestre';
      default:
        return `Grau ${level}`;
    }
  };

  // 2. Identify all categories and count of active books
  const categoriesMap: Record<string, number> = {
    'Todos os livros': books.length
  };

  // Identify all degrees and count of active books
  const degreesMap: Record<number, number> = {};

  books.forEach(b => {
    if (b.status === 'Ativo') {
      const bookCats = b.categories && b.categories.length > 0 ? b.categories : [b.category];
      bookCats.forEach(cat => {
        if (cat) {
          categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
        }
      });
      degreesMap[b.nivelAcesso] = (degreesMap[b.nivelAcesso] || 0) + 1;
    }
  });

  const uniqueDegrees = Object.keys(degreesMap)
    .map(Number)
    .sort((a, b) => a - b);

  const categories = Object.keys(categoriesMap).sort((a, b) => {
    if (a === 'Todos os livros') return -1;
    if (b === 'Todos os livros') return 1;
    return a.localeCompare(b);
  });

  // 3. Filter books
  const filteredBooks = books.filter(book => {
    // Check status
    if (book.status !== 'Ativo') return false;

    const bookCats = book.categories && book.categories.length > 0 ? book.categories : [book.category];

    // Category filter (Left Sidebar menu)
    if (activeCategory !== 'Todos os livros' && !bookCats.includes(activeCategory)) {
      return false;
    }

    // Checkboxes filter
    const activeCheckboxes = Object.entries(checkedCategories)
      .filter(([_, checked]) => checked)
      .map(([cat]) => cat);
    
    if (activeCheckboxes.length > 0) {
      const hasMatchingCategory = bookCats.some(cat => activeCheckboxes.includes(cat));
      if (!hasMatchingCategory) {
        return false;
      }
    }

    // Checkboxes filter for degrees
    const activeDegrees = Object.entries(checkedDegrees)
      .filter(([_, checked]) => checked)
      .map(([level]) => parseInt(level, 10));

    if (activeDegrees.length > 0) {
      if (!activeDegrees.includes(book.nivelAcesso)) {
        return false;
      }
    }

    // Search query matching
    const searchLower = searchQuery.toLowerCase().trim();
    if (searchLower) {
      const matchesTitle = book.title.toLowerCase().includes(searchLower);
      const matchesAuthor = book.author.toLowerCase().includes(searchLower);
      const matchesTags = book.tags.some(t => t.toLowerCase().includes(searchLower));
      const matchesCategory = bookCats.some(cat => cat.toLowerCase().includes(searchLower));
      if (!matchesTitle && !matchesAuthor && !matchesTags && !matchesCategory) {
        return false;
      }
    }

    return true;
  });

  // 4. Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'name-az':
        return a.title.localeCompare(b.title);
      case 'name-za':
        return b.title.localeCompare(a.title);
      case 'grau-asc':
        return a.nivelAcesso - b.nivelAcesso;
      case 'grau-desc':
        return b.nivelAcesso - a.nivelAcesso;
      default:
        return 0;
    }
  });

  const handleAccessBook = (book: Book, e: React.MouseEvent) => {
    const isLocked = !isAdmin && userLevel < book.nivelAcesso;
    if (isLocked) {
      e.preventDefault();
      e.stopPropagation();
      alert(`Acesso Restrito: Este material requer Grau ${book.nivelAcesso}. Seu Grau atual é ${userLevel}.`);
      return;
    }
  };

  const toggleCategoryCheckbox = (cat: string) => {
    setCheckedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const toggleDegreeCheckbox = (level: number) => {
    setCheckedDegrees(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  return (
    <div id="library-view-container" className="flex flex-col lg:flex-row gap-6 animate-fade-in text-left">
      
      {/* LEFT SIDEBAR - CATEGORIES & FILTERS */}
      <aside className="w-full lg:w-64 shrink-0 space-y-6">
        
        {/* Categories Box */}
        <div className="bg-[#0c1d27] rounded-xl p-4 border border-[#1c2c36] shadow-sm" id="library-sidebar-categories">
          <h3 className="font-sans font-extrabold text-xs text-[#E9C349] tracking-wider uppercase mb-3 border-b border-[#1c2c36] pb-2">
            Categorias
          </h3>
          <ul className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setActiveCategory(cat);
                    }}
                    className={`w-full text-left font-sans text-xs px-2.5 py-1.5 rounded transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#E9C349]/15 text-[#f2ca50] font-bold border-l-2 border-l-[#E9C349]'
                        : 'text-[#99907c] hover:text-[#d4e5f2] hover:bg-[#11212b]/60'
                    }`}
                  >
                    <span className="truncate pr-2">{cat}</span>
                    <span className="font-mono text-[10px] bg-[#05151e] px-1.5 py-0.2 rounded border border-[#1c2c36]/60 text-[#99907c]">
                      {categoriesMap[cat]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Filtrar / Filters Checkboxes */}
        <div className="bg-[#0c1d27] rounded-xl p-4 border border-[#1c2c36] shadow-sm" id="library-sidebar-filters">
          <h3 className="font-sans font-extrabold text-xs text-[#E9C349] tracking-wider uppercase mb-3 border-b border-[#1c2c36] pb-2 flex items-center gap-1.5">
            <ListFilter className="w-3.5 h-3.5 text-[#66d9cc]" />
            Filtrar
          </h3>
          
          <div className="space-y-4">
            {/* Search filter inside sidebar */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider">Busca Rápida</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar livros..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#05151e] border border-[#1c2c36] rounded px-2.5 py-1.5 text-xs text-[#d4e5f2] placeholder-[#99907c] focus:outline-none focus:border-[#E9C349]/50 font-sans"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#99907c] hover:text-[#d4e5f2]"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Checkbox filters by category */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider">Categorias de Livros</label>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {categories.filter(cat => cat !== 'Todos os livros').map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#99907c] hover:text-[#d4e5f2] select-none">
                    <input
                      type="checkbox"
                      checked={!!checkedCategories[cat]}
                      onChange={() => toggleCategoryCheckbox(cat)}
                      className="rounded bg-[#05151e] border-[#1c2c36] text-[#E9C349] focus:ring-0 w-3.5 h-3.5 cursor-pointer accent-[#E9C349]"
                    />
                    <span className="truncate">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Checkbox filters by degree */}
            <div className="space-y-2 border-t border-[#1c2c36]/40 pt-3">
              <label className="block text-[10px] font-mono text-[#99907c] uppercase tracking-wider">Grau / Nível</label>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {uniqueDegrees.map(level => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer text-xs font-sans text-[#99907c] hover:text-[#d4e5f2] select-none">
                    <input
                      type="checkbox"
                      checked={!!checkedDegrees[level]}
                      onChange={() => toggleDegreeCheckbox(level)}
                      className="rounded bg-[#05151e] border-[#1c2c36] text-[#E9C349] focus:ring-0 w-3.5 h-3.5 cursor-pointer accent-[#E9C349]"
                    />
                    <span className="truncate">{getDegreeLabel(level)}</span>
                    <span className="ml-auto font-mono text-[9px] bg-[#05151e] px-1.5 py-0.2 rounded border border-[#1c2c36]/60 text-[#99907c]/80">
                      {degreesMap[level] || 0}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <section className="flex-1 space-y-4">
        
        {/* TOP STATUS BAR */}
        <div className="bg-[#0c1d27] rounded-xl p-3.5 border border-[#1c2c36] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm" id="library-top-bar">
          <div className="text-xs font-mono text-[#99907c]">
            Total: <span className="text-[#f2ca50] font-bold">{sortedBooks.length}</span> {sortedBooks.length === 1 ? 'título encontrado' : 'títulos encontrados'}
            {activeCategory !== 'Todos os livros' && (
              <span> em <span className="text-[#66d9cc] font-sans font-bold">{activeCategory}</span></span>
            )}
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[10px] font-mono text-[#99907c] uppercase tracking-wider shrink-0">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#05151e] border border-[#1c2c36] rounded text-xs text-[#d4e5f2] px-2 py-1 focus:outline-none focus:border-[#E9C349]/50 font-sans cursor-pointer"
            >
              <option value="name-az">Nome A-Z</option>
              <option value="name-za">Nome Z-A</option>
              <option value="grau-asc">Grau (Crescente)</option>
              <option value="grau-desc">Grau (Decrescente)</option>
            </select>
          </div>
        </div>

        {/* BOOKS GRID */}
        {sortedBooks.length === 0 ? (
          <div className="bg-[#0c1d27] rounded-xl p-12 border border-[#1c2c36] text-center space-y-3">
            <BookOpen className="w-12 h-12 text-[#99907c] mx-auto opacity-40 animate-pulse" />
            <h4 className="font-sans font-bold text-[#d4e5f2]">Nenhum livro encontrado</h4>
            <p className="font-mono text-xs text-[#99907c] max-w-md mx-auto">
              Nenhum título corresponde aos seus critérios de busca ou filtros selecionados. Tente limpar as opções do filtro.
            </p>
            {(searchQuery || activeCategory !== 'Todos os livros' || Object.values(checkedCategories).some(Boolean) || Object.values(checkedDegrees).some(Boolean)) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('Todos os livros');
                  setCheckedCategories({});
                  setCheckedDegrees({});
                }}
                className="bg-[#E9C349]/10 border border-[#E9C349]/30 hover:bg-[#E9C349]/20 text-[#f2ca50] text-xs font-mono font-bold px-4 py-2 rounded transition-all cursor-pointer"
              >
                Limpar Filtros e Busca
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" id="library-books-grid">
            {sortedBooks.map((book) => {
              const isLocked = !isAdmin && userLevel < book.nivelAcesso;
              
              return (
                <div
                  key={book.id}
                  id={`book-card-${book.id}`}
                  className="bg-[#0c1d27] rounded-xl overflow-hidden border border-[#1c2c36]/60 shadow-md hover:shadow-lg hover:border-[#1c2c36] transition-all duration-200 flex flex-col justify-between group relative"
                >
                  
                  {/* Lock badge overlay */}
                  <div className="absolute top-2 right-2 z-10">
                    {isLocked ? (
                      <span className="bg-red-950/90 border border-red-500/50 text-red-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow backdrop-blur-xs">
                        <Lock className="w-2.5 h-2.5 text-red-400" />
                        Grau {book.nivelAcesso}
                      </span>
                    ) : (
                      <span className="bg-emerald-950/80 border border-emerald-500/40 text-[#66d9cc] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow backdrop-blur-xs">
                        <Unlock className="w-2.5 h-2.5 text-emerald-400" />
                        Grau {book.nivelAcesso}
                      </span>
                    )}
                  </div>

                  {/* Thumbnail / Cover section with standard 3:4 aspect ratio */}
                  <div className="relative aspect-[3/4] bg-[#05151e] overflow-hidden border-b border-[#1c2c36]/40">
                    {book.thumbnailUrl ? (
                      <img
                        src={book.thumbnailUrl}
                        alt={book.title}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                          isLocked ? 'filter brightness-[0.35] blur-[1px]' : 'filter brightness-[0.85]'
                        }`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-[#99907c] space-y-1">
                        <BookOpen className="w-8 h-8 opacity-40" />
                        <span className="text-[10px] font-mono">Sem capa</span>
                      </div>
                    )}

                    {/* Restricted/Locked cover watermark overlay */}
                    {isLocked && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/60 backdrop-blur-xs select-none">
                        <Lock className="w-8 h-8 text-red-500 mb-2 animate-bounce" />
                        <span className="text-xs font-sans font-bold text-red-400 leading-tight uppercase tracking-wide">
                          Conteúdo Bloqueado
                        </span>
                        <span className="text-[10px] font-mono text-[#99907c] mt-1">
                          Requer Grau {book.nivelAcesso}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Information Details block */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      {/* Category tag */}
                      <span className="text-[9px] font-mono text-[#E9C349] uppercase tracking-widest font-black block truncate" title={(book.categories && book.categories.length > 0 ? book.categories : [book.category]).join(', ')}>
                        {(book.categories && book.categories.length > 0 ? book.categories : [book.category]).join(', ')}
                      </span>
                      
                      {/* Book Title */}
                      <h4 className="font-sans font-bold text-xs text-[#d4e5f2] leading-snug group-hover:text-[#f2ca50] transition-colors line-clamp-2 uppercase min-h-[2rem]">
                        {book.title}
                      </h4>

                      {/* Author */}
                      <p className="font-mono text-[10px] text-[#99907c] truncate">
                        Por: <span className="text-slate-300 font-sans font-medium">{book.author}</span>
                      </p>
                    </div>

                    {/* Book tags */}
                    <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden py-0.5">
                      {book.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-[#11212b] text-[8px] font-mono text-[#99907c] px-1 rounded border border-[#1c2c36]/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons list */}
                    <div className="pt-2 border-t border-[#1c2c36]/40 mt-1">
                      {isLocked ? (
                        <button
                          disabled
                          className="w-full bg-red-950/20 text-[#99907c]/60 border border-red-900/30 font-mono font-bold text-[10px] py-2 rounded flex items-center justify-center gap-1.5 cursor-not-allowed select-none uppercase"
                        >
                          <Lock className="w-3 h-3 text-red-500/60" />
                          <span>Bloqueado</span>
                        </button>
                      ) : (
                        <a
                          href={book.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => handleAccessBook(book, e)}
                          className="w-full bg-[#E9C349]/15 hover:bg-[#E9C349]/35 border border-[#E9C349]/40 hover:border-[#E9C349] text-[#f2ca50] hover:text-white font-mono font-bold text-[10px] py-2 rounded flex items-center justify-center gap-1.5 transition-all transform active:scale-95 shadow-sm uppercase cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-[#E9C349]" />
                          <span>Acessar Livro</span>
                          <ExternalLink className="w-2.5 h-2.5 text-[#E9C349]/70 shrink-0" />
                        </a>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

    </div>
  );
}
