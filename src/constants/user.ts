export const emailRegex = /^\S+@\S+\.\S+$/;

export const fullNameRegex = /^([0-9\p{L}]+([-,`.\s;=']?))+$/u;

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\\\/\-\[\]`^=_<>;:,.+()'"#|@$!%*?&])[A-Za-z\d\\\/\-\[\]`^=_<>;:,.+()'"#|@$!%*?&]{8,}$/;

export const roles: string[] = ['user', 'admin'];
