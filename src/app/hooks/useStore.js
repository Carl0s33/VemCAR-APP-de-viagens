import { create } from 'zustand';

const useStore = create((set) => ({
  categoriaInicial: "VEM CAR",
  setCategoriaInicial: (categoria) => set({ categoriaInicial: categoria }),

  usuarioLogado: null,
  setUsuarioLogado: (usuario) => set({ usuarioLogado: usuario }),

  // Adicione mais estados globais conforme necessário
}));

export default useStore;
