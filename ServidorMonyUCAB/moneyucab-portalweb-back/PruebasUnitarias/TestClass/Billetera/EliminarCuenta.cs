﻿using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace PruebasUnitarias.TestClass.Billetera
{
    [TestClass]
    public class EliminarCuenta
    {
        [TestInitialize]
        public void TestInitialize()
        {
        }

        [TestCleanup]
        public void TestCleanup()
        {
        }

        [TestMethod]
        public void eliminarCuenta()
        {
            int CuentaId = 1;
            Task<HttpResponseMessage> res = null;
            res = APITest.EliminarCuenta(CuentaId);
            var status = res.Result.StatusCode;
            Assert.IsTrue(status == HttpStatusCode.OK);
        }

        [TestMethod]
        public void eliminarCuenta_invalidoCuentaNoRegistrada()
        {
            int CuentaId = -1;
            Task<HttpResponseMessage> res = null;
            res = APITest.EliminarCuenta(CuentaId);
            var status = res.Result.StatusCode;
            Assert.IsTrue(status == HttpStatusCode.BadRequest);
        }
    }
}
