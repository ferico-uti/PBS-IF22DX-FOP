import { NextRequest, NextResponse } from "next/server";
import { getResponseUserNotFound, prisma, setBcrypt } from "../../general";

// buat service "DELETE" (parameter = id) tb_user
export const DELETE = async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;

    // cek apakah id ada / tidak
    const check = await prisma.tb_user.findUnique({
        where: {
            id: Number(params.id),
        }
    })

    // jika data "username" ditemukan
    if (!check) {
        return NextResponse.json({
            meta_data: {
                error: 1,
                message: "Data User Gagal Dihapus ! ID User Tidak Ditemukan !",
                status: 404
            },
        }, {
            status: 404
        })
    }

    // proses delete data
    const query = await prisma.tb_user.delete({
        where: {
            id: Number(params.id),
        }
    })

    // proses / response API
    return NextResponse.json({
        meta_data: {
            error: 0,
            message: "Data User Berhasil Dihapus",
            status: 200
        },
    }, {
        status: 200
    })
}

// buat service "GET" (detail data) tb_user
export const GET = async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {

    try {

        const params = await props.params;

        // cek apakah id ada / tidak
        const check = await prisma.tb_user.findUnique({
            where: {
                id: Number(params.id),
            }
        })

        // jika data user tidak ditemukan
        if (!check) {
            return getResponseUserNotFound
        }

        // proses / response API
        return NextResponse.json({
            meta_data: {
                error: 0,
                message: null,
                status: 200
            },
            data_user: check
        }, {
            status: 200
        })

    }
    catch (e: any) {
        return NextResponse.json({
            meta_data: {
                error: 1,
                message: "Parameter Slug Harus Angka !",
                status: 400
            },
        }, {
            status: 400
        })
    }

}

// buat service "PUT" (edit data) tb_user
export const PUT = async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;

    // cek apakah id ada / tidak
    const check = await prisma.tb_user.findUnique({
        where: {
            id: Number(params.id),
        }
    })

    // jika data user tidak ditemukan
    if (!check) {
        return NextResponse.json({
            meta_data: {
                error: 1,
                message: "Data User Tidak Ditemukan !",
                status: 404
            },
        }, {
            status: 404
        })
    }

    // buat object untuk data isian
    const { nama_value, username_value, password_value } = await request.json()

    // cek apakah username sudah pernah ada / belum
    const checkUsername = await prisma.tb_user.findMany({
        where: {
            username: username_value,
            // id: {not: Number(params.id)}
            NOT: { id: Number(params.id) }
        }
    })

    // jika data "username" ditemukan
    if (checkUsername.length >= 1) {
        return NextResponse.json({
            meta_data: {
                error: 1,
                message: "Data User Gagal Diubah ! Username Sudah Terdaftar !",
                status: 409
            },
        }, {
            status: 409
        })
    }

    const edit = await prisma.tb_user.update({
        where: {
            id: Number(params.id),
        },
        data: {
            nama: nama_value,
            username: username_value,
            password: setBcrypt(password_value)
        },
    })

    // proses / response API
    return NextResponse.json({
        meta_data: {
            error: 0,
            message: "Data User Berhasil Diubah",
            status: 200
        },
    }, {
        status: 200
    })
}