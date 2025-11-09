import { User } from '../app/modules/user/user.model';

export const generateUsername = async (email: string = '') => {
  let baseName = 'user';

  if (email && email.includes('@')) {
    baseName = email.split('@')[0];
  }

  let username = baseName;
  let exists = true;

  while (exists) {
    const randomNum = Math.floor(Math.random() * 1000000); // 6 digits ---> 999999 possibilities
    username = `${baseName}${randomNum}`;
    exists = !!(await User.exists({ username }));
  }

  return username;
};
