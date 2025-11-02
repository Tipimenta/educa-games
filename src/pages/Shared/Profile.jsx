import { useContext, useState } from 'react';

import { Button, Input, PageTitle } from '../../components';
import AppLayout from '../../components/AppLayout';
import { AuthContext } from '../../context';
import { useAuth } from '../../hooks';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const { logout } = useAuth();

  const [userName, setUserName] = useState(user?.name || '');

  const [profileImage, setProfileImage] = useState(
    `https://placehold.co/100x100/E2E8F0/4A5568?text=${user?.name?.charAt(0).toUpperCase() || 'U'}`
  );
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');

  // Sidebar é gerenciada pelo AppLayout

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Perfil atualizado com sucesso!');
  };

  return (
    <AppLayout user={user} onLogout={logout}>
      <PageTitle>Meu Perfil</PageTitle>

      <div className="rounded-lg bg-white p-8 shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center md:flex-row md:items-start">
            <div className="mb-6 flex flex-col items-center md:mr-10 md:mb-0">
              <img
                src={profileImage}
                alt="Foto do Perfil"
                className="h-32 w-32 rounded-full object-cover"
              />
              <label
                htmlFor="profile-upload"
                className="mt-4 cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
              >
                Trocar Foto
              </label>
              <input
                id="profile-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="w-full flex-1">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="name">
                  Nome
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="birthdate">
                  Data de Nascimento
                </label>
                <Input
                  id="birthdate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-bold text-gray-700" htmlFor="bio">
                  Biografia
                </label>
                <textarea
                  id="bio"
                  placeholder="Fale um pouco sobre você..."
                  className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows="4"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
              </div>
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
