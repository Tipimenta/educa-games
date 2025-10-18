import { useState } from 'react';

import Button from '../components/Button';
import Header from '../components/Header';
import Input from '../components/Input';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = ({ user }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { logout } = useAuth();

  const [userName, setUserName] = useState(user?.name || '');

  const [profileImage, setProfileImage] = useState(
    `https://placehold.co/100x100/E2E8F0/4A5568?text=${user?.name?.charAt(0).toUpperCase() || 'U'}`
  );
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMouseEnter = () => {
    setSidebarCollapsed(false);
  };

  const handleMouseLeave = () => {
    setSidebarCollapsed(true);
  };

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
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        userRole={user?.role}
      />

      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Header user={user} toggleSidebar={toggleSidebar} onLogout={logout} />

        <main className="flex-grow p-6">
          <h2 className="mb-6 text-3xl font-bold text-gray-800">Meu Perfil</h2>

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
                    <label
                      className="mb-2 block text-sm font-bold text-gray-700"
                      htmlFor="birthdate"
                    >
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
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
