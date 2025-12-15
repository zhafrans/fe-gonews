'use client'

import axiosInstance from "@/lib/axios"
import { ApiResponse } from "@/model/ApiResponse"
import { Content } from "@/model/Content"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"

type Params = {
    id: number
}

interface ContentDetailPageProps {
    params: Promise<Params>
}


export default function ContentDetail({params}: ContentDetailPageProps) {
    const resolvedParams = React.use(params)
    const [contents, setContents] = useState<Content | null>(null)

    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<ApiResponse<Content>>(`/fe/contents/${resolvedParams.id}`)
        setContents(response.data.data)
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error fetch",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        })
      }
    }
    
    fetchData()
  }, [resolvedParams.id])

  return (
    <div>
        <div className="container px-8 mx-auto xl:px-5 max-w-screen-lg py-5 lg:py-8 !pt-0">
            <h1 className="mx-auto max-w-screen-md">
                <div className="flex justify-center">
                    <div className="flex gap-3">
                        <Link href={`category/${contents?.category_id}`}>
                            <span className="inline-block text-sm font-medium tracking-wider uppercase mt-5 text-blue-500">
                                {contents?.category_name}
                            </span>
                        </Link>
                    </div>
                </div>
            </h1>
            <h2 className="text-brand-primary mb-3 mt-2 text-center text-3xl font-semibold tracking-light lg:text-4xl lg:leading-snug">
            <span className="inline-block text-sm font-medium tracking-wider uppercase mt-5 text-blue-500">{contents?.title}</span>
            </h2>
            <div className="ml-3 flex justify-center space-x-3 text-gray-500">
                <div className="flex items-center gap-3">
                    <div className="">
                        <p className="text-gray-800">
                            {contents?.author}
                        </p>
                        <div className="flex items-center space-x-2 text-sm">
                            <time dateTime={contents?.created_at} className="text-gray-500">{contents?.created_at}</time>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <div className="relative z-0 mx-auto aspect-ratio max-w-screen-lg overflow-hidden lg:rounded-lg flex justify-center">
            {contents?.image !== "" && (
            <Image
                src={`https://picsum.photos/600/400?random=${contents?.id}`}
                alt={contents?.title ?? "content image"}
                width={600}
                height={400}
                className="object-cover transition-all"
                />
            )}  
        </div>
        <div className="container px-8 mx-auto xl:px-5 max-w-screen-lg py-5 lg:py-8">
            <article className="mx-auto max-w-screen-md">
                <div className="prose mx-auto my-3 text-center">
                    {contents?.description}
                </div>
                <div className="mb-7 mt-7 flex justify-center">
                    <Link href={"/content-all"} className="bg-brand-secondary/20 rounded-full px-5 py-2 text-sm text-blue-600">
                        Lihat semua konten
                    </Link>
                </div>
            </article>
        </div>
    </div>
  )
}
    
