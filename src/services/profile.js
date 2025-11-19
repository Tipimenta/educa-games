import { axiosInstance } from './api';

const USER_PATH = '/v1/user';

const extractProfile = (response) => response?.data || response;

export const profileService = {
  get: async () => {
    const response = await axiosInstance.get(`${USER_PATH}/profile`);
    return extractProfile(response);
  },

  update: async ({
    name,
    birthDate,
    description,
    clearDescription = false,
    removeAvatar = false,
    avatarFile = null,
  }) => {
    const form = new FormData();

    const dto = {
      name: typeof name === 'string' ? name : null,
      birthDate: typeof birthDate === 'string' && birthDate.trim().length > 0 ? birthDate : null,
      description: typeof description === 'string' ? description : null,
      clearDescription: Boolean(clearDescription),
      removeAvatar: Boolean(removeAvatar),
    };

    const dataBlob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
    form.append('data', dataBlob);

    if (!removeAvatar && avatarFile instanceof File) {
      // Adiciona timestamp ao nome do arquivo para evitar conflitos de duplicação
      const timestamp = Date.now();
      const fileExtension = avatarFile.name.split('.').pop();
      const baseName = avatarFile.name.replace(/\.[^/.]+$/, '');
      const uniqueFileName = `${baseName}_${timestamp}.${fileExtension}`;

      // Cria um novo File com o nome único mantendo o tipo e conteúdo originais
      const uniqueFile = new File([avatarFile], uniqueFileName, {
        type: avatarFile.type,
        lastModified: avatarFile.lastModified,
      });

      form.append('avatar', uniqueFile);
    }

    const response = await axiosInstance.patch(`${USER_PATH}/profile`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return extractProfile(response);
  },
};
