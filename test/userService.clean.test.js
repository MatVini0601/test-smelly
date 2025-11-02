// __tests__/userService.clean.test.js
const { UserService } = require('../src/userService');

describe('UserService - Suíte de Testes Limpa', () => {
  let userService;
  const dadosUsuarioPadrao = {
    nome: 'Fulano de Tal',
    email: 'fulano@teste.com',
    idade: 25,
  };

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  // Teste 1 - Criação e busca de usuário
  test('deve criar um usuário e permitir sua recuperação por ID', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioPadrao;

    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioBuscado.nome).toBe(nome);
    expect(usuarioBuscado.status).toBe('ativo');
  });

  // Teste 2 - Desativação de usuário comum
  test('deve desativar um usuário comum corretamente', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  // Teste 3 - Tentativa de desativar usuário administrador
  test('não deve desativar um usuário administrador', () => {
    // Arrange
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

    // Assert
    expect(resultado).toBe(false);
    expect(usuarioAtualizado.status).toBe('ativo');
  });

  // Teste 4 - Geração de relatório de usuários
  test('deve gerar um relatório de usuários contendo informações básicas de cada usuário', () => {
    // Arrange
    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    const usuario2 = userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain(usuario1.nome);
    expect(relatorio).toContain(usuario2.nome);
    expect(relatorio).toMatch(/Relatório de Usuários/);
  });

  // Teste 5 - Criação de usuário menor de idade
  test('deve lançar erro ao tentar criar usuário menor de idade', () => {
    // Arrange
    const criarMenor = () => userService.createUser('Menor', 'menor@email.com', 17);

    // Act e Assert
    expect(criarMenor).toThrow('O usuário deve ser maior de idade.');
  });

  // Teste 6 - Lista vazia de usuários
  test('deve retornar uma lista vazia quando não há usuários cadastrados', () => {
    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Nenhum usuário encontrado');
  });
});
