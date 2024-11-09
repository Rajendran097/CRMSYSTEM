﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WebApplication5.Data;

#nullable disable

namespace WebApplication5.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241031064541_AlterEmployee")]
    partial class AlterEmployee
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Lead", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Admin")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("AdminRemarks")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("DOB")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Gender")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsApproved")
                        .HasColumnType("bit");

                    b.Property<string>("LeadId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LeadName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LeadStatus")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("LoanAmount")
                        .HasColumnType("int");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Remarks")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesHead")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesHeadRemarks")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesOfficer")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SchemeName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Leads");
                });

            modelBuilder.Entity("WebApplication5.Models.Entities.Employee", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EmpCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EmpName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("EmployeeStatus")
                        .HasColumnType("int");

                    b.Property<DateTime?>("LastLogin")
                        .HasColumnType("datetime2");

                    b.Property<string>("Passwordhash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Phone")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Employees");
                });

            modelBuilder.Entity("WebApplication5.Models.Entities.LeadReports", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Address")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Admin")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("AdminRemarks")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("DOB")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Gender")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LeadId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LeadName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LeadStatus")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("LoanAmount")
                        .HasColumnType("int");

                    b.Property<string>("Phone")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesHead")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesHeadRemarks")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesOfficer")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesOfficerRemarks")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SchemeName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("LeadsReports");
                });

            modelBuilder.Entity("WebApplication5.Models.Entities.TaskEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Admin")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("AdminRemarks")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EmpCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EmpName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Remarks")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesHead")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesHeadRemarks")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesOfficer")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesOfficerRemarks")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("TargetDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("TaskId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TaskName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TaskStatus")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Tasks");
                });

            modelBuilder.Entity("WebApplication5.Models.Entities.TaskReports", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Admin")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("AdminRemarks")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EmpCode")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("EmpName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesHead")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesHeadRemark")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesOfficer")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SalesOfficerRemarks")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("TargetDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("TaskId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TaskName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TaskStatus")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("TaskReports");
                });
#pragma warning restore 612, 618
        }
    }
}
