import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { RIVE_GAUCHE_API } from '../core/constants/api.constants';

export const searchInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (req.url.startsWith('/rg/')) {
    const apiReq = req.clone({
      url: `${RIVE_GAUCHE_API}${req.url}`,
      setHeaders: {
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'ru',
      }
    })
    return next(apiReq);
  }
  return next(req);
};
