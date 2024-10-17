const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sFuncao = document.querySelector('#m-funcao');
const sSalario = document.querySelector('#m-salario');
const btnSalvar = document.querySelector('#btnSalvar');

// declara as variaveis 
let itens; // armazena a lista de funcionarios
let id; // armazena o indice quando editar um item


// Função para buscar itens do servidor (GET)
const getItensBD = async () => {
  const response = await fetch('http://localhost:3000/funcionarios');
  return await response.json();
};

// Função para adicionar um item ao servidor (POST)
const addItemBD = async (item) => {
  await fetch('http://localhost:3000/funcionarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
};

// Função para editar um item no servidor (PUT)
const editItemBD = async (id, item) => {
  await fetch(`http://localhost:3000/funcionarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
};

// Função para deletar um item do servidor (DELETE)
const deleteItemBD = async (id) => {
  await fetch(`http://localhost:3000/funcionarios/${id}`, {
    method: 'DELETE',
  });
};

// Função para carregar os itens da tabela
async function loadItens() {
  itens = await getItensBD();
  tbody.innerHTML = '';
  itens.forEach((item, index) => {
    insertItem(item, index);
  });
}

loadItens();

// Função para inserir item na tabela
function insertItem(item, index) {
  let tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${item.nome}</td>
    <td>${item.funcao}</td>
    <td>R$ ${item.salario}</td>
    <td class="acao">
        <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
    </td>
    <td class="acao">
        <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}

// Função para editar item
function editItem(index) {
  openModal(true, index);
}

// Função para deletar item
async function deleteItem(index) {
  const item = itens[index];
  await deleteItemBD(item.id);
  loadItens();
}

// Função para abrir o modal
function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  modal.onclick = (e) => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  if (edit) {
    sNome.value = itens[index].nome;
    sFuncao.value = itens[index].funcao;
    sSalario.value = itens[index].salario;
    id = itens[index].id;
  } else {
    sNome.value = '';
    sFuncao.value = '';
    sSalario.value = '';
  }
}

// Função para salvar item (adicionar ou editar)
btnSalvar.onclick = async (e) => {
  if (sNome.value === '' || sFuncao.value === '' || sSalario.value === '') {
    return;
  }

  e.preventDefault();

  const funcionario = {
    nome: sNome.value,
    funcao: sFuncao.value,
    salario: sSalario.value,
  };

  if (id !== undefined) {
    await editItemBD(id, funcionario);
  } else {
    await addItemBD(funcionario);
  }

  modal.classList.remove('active');
  loadItens();
  id = undefined;
};