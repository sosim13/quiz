const users = [
  { email: 'test@m.mm', password: '321', name: 'test' },
  { email: 'test2@m.mm', password: '321', name: 'test2' },
  { email: 'test3@m.mm', password: '321', name: 'test3' }
]

export function signIn({ email, password }) {
  const user = users.find(user => user.email === email && user.password === password);
  if (user === undefined) throw new Error();
  return user;
}