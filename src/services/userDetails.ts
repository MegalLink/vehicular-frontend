import axiosInstance from '../lib/axios'

export interface UserDetail {
  _id?: string;
  userID?: string;
  firstName: string;
  lastName: string;
  identityDocumentNumber: string;
  identityDocumentType: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  phone: string;
}


export const userDetailsService = {
  getUserDetails: async (): Promise<UserDetail[]> => {
  const response = await axiosInstance.get('/user-detail');
  return response.data;
},

createUserDetail: async (userDetail: UserDetail): Promise<UserDetail> => {
  const response = await axiosInstance.post('/user-detail', userDetail);
  return response.data;
},

updateUserDetail: async (id: string, userDetail: UserDetail): Promise<UserDetail> => {
  const response = await axiosInstance.patch(`/user-detail/${id}`, userDetail);
  return response.data;
},

deleteUserDetail: async (id: string): Promise<void> => {
  await axiosInstance.delete(`/user-detail/${id}`);
},

getUserDetailById: async (id: string): Promise<UserDetail> => {
  const response = await axiosInstance.get(`/user-detail/${id}`);
  return response.data;
}
}