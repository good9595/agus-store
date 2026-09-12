# AgusStore

es [Español](README.md) | 🇺🇸 [English](README.en.md)

> Plataforma e-commerce full-stack desarrollada con Next.js, Prisma y PostgreSQL.

## Visión general

Modelo de **e-commerce** moderno construido en Next.js, que incluye autenticación de usuarios, catálogo dinámico de productos por categoría y persistencia de datos mediante Prisma ORM.

## Funcionalidades

- Autenticación segura (Next-Auth + bcrypt).
- Catálogo estructurado con gestión de categorías.
- Sistema de pedidos y rutas de API dedicadas para operaciones CRUD.
- Interfaz responsiva diseñada con React Bootstrap y scripts de inicialización de datos.

## Stack

Next.js 13 · TypeScript · Prisma ORM · PostgreSQL · Next-Auth · React Bootstrap · bcrypt.

## Cómo ejecutar

```bash
npm install
npx prisma generate
npm run dev          # http://localhost:3000