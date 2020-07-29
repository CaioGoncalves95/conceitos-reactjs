import React, { useState, useEffect } from "react";

import "./styles.css";

import api from './services/api';

let reposNumber = 1;

function App() {

  const [repos, updateRepos] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      updateRepos(response.data)
    })
  }, []);

  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      title: `Repo number ${reposNumber++}`,
      url: 'http://github.com/newRepo',
      techs: '[New techs]'
    });
    const newRepo = response.data;

    updateRepos([...repos, newRepo]);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`);

    updateRepos(repos.filter(repo => repo.id !== id))
  }

  async function handleAddLike(id) {
    const response = await api.post(`/repositories/${id}/like`, {}); // tenho a resposta de quantos likes o repo tem agora
    const repoIndex = repos.findIndex(repo => repo.id === response.data.id); // acho o index desse repo no meu state
    const reposToUpdate = [...repos]; // uso imutabilidade para pegar meus repos
    reposToUpdate[repoIndex].likes = response.data.likes; // atualizo o numero de likes do repo com o novo nr de likes

    updateRepos(reposToUpdate); //atualiza state dos componentes
  }

  return (
    <div>
      <button className="button-add" onClick={handleAddRepository}>Add</button>
      <ul data-testid="repository-list">
        {repos.map(repo =>  <li key={repo.id}>{repo.title}
                              <button onClick={() => handleRemoveRepository(repo.id)}>Remove</button>
                              <button onClick={() => handleAddLike(repo.id)}>Like</button>
                              Likes: {repo.likes}
                            </li>)}
      </ul>
    </div>
  );
}

export default App;
