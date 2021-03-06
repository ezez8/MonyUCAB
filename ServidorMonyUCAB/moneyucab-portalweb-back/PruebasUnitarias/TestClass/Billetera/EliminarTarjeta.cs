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
    public class EliminarTarjeta
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
        public void eliminarTarjeta()
        {
            int TarjetaId = 1;
            Task<HttpResponseMessage> res = null;
            res = APITest.EliminarTarjeta(TarjetaId);
            var status = res.Result.StatusCode;
            Assert.IsTrue(status == HttpStatusCode.OK);
        }

        [TestMethod]
        public void eliminarTarjeta_invalidoTarjetaNoRegistrada()
        {
            int TarjetaId = -1;
            Task<HttpResponseMessage> res = null;
            res = APITest.EliminarTarjeta(TarjetaId);
            var status = res.Result.StatusCode;
            Assert.IsTrue(status == HttpStatusCode.BadRequest);
        }
    }
}
