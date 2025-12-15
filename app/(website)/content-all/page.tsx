'use client'

import { Button } from "@/components/ui/button"
import axiosInstance from "@/lib/axios"
import { ApiResponse, Pagination } from "@/model/ApiResponse"
import { Content } from "@/model/Content"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export default function ContentAll() {
    const [contents, setContents] = useState<Content[]>([])
    const [pagination, setPagination] = useState<Pagination|null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const fetchData = async (page:number = 1) => {
      try {
        const response = await axiosInstance.get<ApiResponse<Content[]>>(`/fe/contents/?limit=3&page=${page}`)
        setContents(response.data.data)
        setPagination(response.data.pagination ?? null)
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
useEffect(() => {
    fetchData(currentPage)
}, [currentPage]);

const handlePrevClick = () => {
    if (pagination && currentPage > 1) {
        setCurrentPage(currentPage - 1)
    }
}

const handleNextClick = () => {
    if (pagination && currentPage < pagination.total_pages) {
        setCurrentPage(currentPage + 1)
    }
}

return (
    <div>
        <div className="container px-8 mx-auto xl:px-5 max-w-screen-lg py-5 lg:py-8 relative">
            <h1 className="text-center text-3xl font-semibold tracking-tight lg:text-4xl lg:leading-snug">
                Konten
            </h1>
            <div className="text-center">
                <p className="mt-2 text-lg">Lihat Semua Konten</p>
            </div>
            <div className="mt-10 grid gap-10 md:grid-cols-2 lg:gap-10 xl:grid-cols-3">
                {contents.map((content, index) => (
                    <div key={index} className="group cursor-pointer">
                        <div className="overflow-hidden rounded-md bg-gray-100 transition-all hover:scale-150">
                            <Link className="relative block aspect-ratio" href={`/content/${content.id}`}>
                                {content.image !== "" && (
                                    <Image
                                        src={`https://picsum.photos/600/400?random=${index + 3}`}
                                        alt={content.title}
                                        width={600}
                                        height={400}
                                        className="object-cover transition-all"
                                    />
                                )}
                            </Link>
                        </div>
                        <div>
                            <div className="flex gap-3">
                                <Link href={`/category/${content.category_id}`}>
                                    <span className="inline-block text-sm font-medium tracking-wider uppercase mt-5 text-blue-500">{content.category_name}</span>
                                </Link>
                            </div>
                            <h2 className="text-lg font-semibold leading snug tracking-tight mt-2">
                                 <Link href={`/content-all/detail/${content.id}`}>
                                    <span className="inline-block text-sm font-medium tracking-wider uppercase mt-5 text-blue-500">{content.title}</span>
                                </Link>
                            </h2>
                            <div className="mt-3 flex items-center space-x-3 text-gray-500">
                                <Link href={`/author/${content.created_by_id}`}>
                                <div className="flex items-center gap-3">
                                <div className="relative h-5 w-5 flex-shrink-0">
                                    <img src="https::/placehold.co/32x32" alt="author" className="rounded-full object-cover" sizes="20px" />
                                    <span className="truncate text-sm">{content.author}</span>
                                </div>
                                </div>
                                </Link>
                                <span className="text-xs text-gray-300 ">.</span>
                                <time dateTime={content.created_at} className="truncate text-sm">{content.created_at}</time>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {pagination && (
                <div className="mt-10 flex items-center justify-center">
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        <Button
                            onClick={handlePrevClick}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center gap-1 rounded-l-md border border-gray-300 bg-white px-3 py-2 pr-4 text-sm font-medium text-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40">
                                <ArrowLeft className="h3 w-3 stroke-1"/>
                                <span className="text-black">Previous</span>
                            </Button>
                            <Button
                                onClick={handleNextClick}
                                disabled={pagination.total_pages <= currentPage}
                                className="relative inline-flex items-center gap-1 rounded-r-md border border-gray-300 bg-white px-3 py-2 pl-4 text-sm font-medium text-gray-50 focus:z-20 disabled:pointer-events-none disabled:opacity-40">
                                    <ArrowRight className="h3 w-3 stroke-1"/>
                                    <span className="text-black">Next</span>
                                </Button>
                    </nav>
                </div>
            )}
        </div>
    </div>
)
}

