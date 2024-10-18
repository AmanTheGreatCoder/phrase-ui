import { AxiosRequestConfig, AxiosResponse } from "axios"
import { af } from "../../fetcher"
import { IApiResponse } from "../../types"

export class BaseClient {
  private readonly prefix: string

  constructor(prefix?: string) {
    this.prefix = prefix ? `/${prefix}` : ""
  }

  protected async get<T extends { [key: string]: any }>(
    path: string,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<IApiResponse<T>>> {
    const response = await af.get<IApiResponse<T>>(this.prefix + path, options)
    return response
  }

  protected async post<
    T extends { [key: string]: any },
    B extends { [key: string]: any } | any = any
  >(
    path: string,
    body?: B,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<IApiResponse<T>>> {
    const response = await af.post<IApiResponse<T>>(this.prefix + path, body, {
      ...options,
    })
    return response
  }

  protected async put<
    T extends { [key: string]: any },
    B extends { [key: string]: any } | any = any
  >(
    path: string,
    body: B,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<IApiResponse<T>>> {
    const response = await af.put<IApiResponse<T>>(this.prefix + path, body, {
      ...options,
    })
    return response
  }

  protected async delete<T extends { [key: string]: any }>(
    path: string,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<IApiResponse<T>>> {
    const response = await af.delete<IApiResponse<T>>(
      this.prefix + path,
      options
    )
    return response
  }

  protected async patch<
    T extends { [key: string]: any },
    B extends { [key: string]: any } | any = any
  >(
    path: string,
    body: B,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<IApiResponse<T>>> {
    const response = await af.patch<IApiResponse<T>>(this.prefix + path, body, {
      ...options,
    })
    return response
  }

  async postForm<
    T extends { [key: string]: any },
    B extends { [key: string]: any } | any = any
  >(
    path: string,
    body?: B,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<IApiResponse<T>>> {
    const response = await af.postForm<IApiResponse<T>>(
      this.prefix + path,
      body,
      {
        ...options,
      }
    )
    return response
  }

  protected async putForm<
    T extends { [key: string]: any },
    B extends { [key: string]: any } | any = any
  >(
    path: string,
    body?: B,
    options?: AxiosRequestConfig
  ): Promise<AxiosResponse<IApiResponse<T>>> {
    const response = await af.putForm<IApiResponse<T>>(
      this.prefix + path,
      body,
      {
        ...options,
      }
    )
    return response
  }
}
