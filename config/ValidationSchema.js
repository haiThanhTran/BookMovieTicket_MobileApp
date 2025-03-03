// validationSchema.js
import * as Yup from 'yup';

export const registrationValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Tên người dùng phải có ít nhất 2 ký tự')
    .required('Tên người dùng là bắt buộc'),
  email: Yup.string()
    .email('Địa chỉ email không hợp lệ')
    .required('Email là bắt buộc'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});


export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Địa chỉ email không hợp lệ')
    .required('Email là bắt buộc'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc')
});
