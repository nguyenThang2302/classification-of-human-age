const UserMapper = module.exports;

UserMapper.toUserInfo = (data) => ({ data: {
  id: data.id,
  name: data.name,
  email: data.email,
  is_2fa_enabled: data.is_2fa_enabled,
}});
