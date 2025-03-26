import { NextRequest, NextResponse } from "next/server";
import { getResponseUserNotFound, prisma, setBcrypt } from "../general";

// buat fungsi service "GET" (tb_user)
export const GET = async () => {
    // tampilkan record/data dari tb_user
    const view = await prisma.tb_user.findMany({})

    // jika data tidak ada
    if (view.length == 0) {
        return getResponseUserNotFound
    }

    // proses / response API
    return NextResponse.json({
        meta_data: {
            error: 0,
            message: null,
            status: 200
        },
        data_user: view
    }, {
        status: 200
    })
}

// buat service "POST" (tb_user) untuk simpan data
export const POST = async (request: NextRequest) => {
    // buat object untuk data isian
    const { nama_value, username_value, password_value } = await request.json()

    // cek apakah username sudah pernah dibuat / belum
    const check = await prisma.tb_user.findMany({
        where: {
            username: username_value
        }
    })

    // jika data "username" ditemukan
    if (check.length >= 1) {
        return NextResponse.json({
            meta_data: {
                error: 1,
                message: "Data User Gagal Disimpan ! Username Sudah Terdaftar !",
                status: 409
            },
        }, {
            status: 409
        })
    }

    // simpan data
    const save = await prisma.tb_user.create({
        data: {
            nama: nama_value,
            username: username_value,
            password: setBcrypt(password_value)
        }
    })

    // proses / respon API
    return NextResponse.json({
        meta_data: {
            error: 0,
            message: "Data User Berhasil Disimpan",
            status: 201
        }
    }, {
        status: 201
    })
}
