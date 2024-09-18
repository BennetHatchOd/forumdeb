export interface StatusResponse <T = null> {
    success: boolean; 
    message?: string;  
    data?: T;         
  }