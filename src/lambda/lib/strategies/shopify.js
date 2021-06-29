import { Router } from "express"
import passport from "passport"
import { Strategy } from "passport-shopify"

const router = Router()

router.use((req, _res, next) => {
  if (!passport._strategy(Strategy.Strategy.name)) {
      passport.use(
          new Strategy.Strategy({
                  clientID: "c84da272b6958cb608390d7f115dfeff",
                  clientSecret: "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",
                  callbackURL: `http://localhost:9000/.netlify/functions/auth/shopify/callback`,
                  shop: "dom-storetest" // e.g. my-shop-name.myshopify.com ... the `my-shop-name` part
              },
              function(_accessToken, _refreshToken, profile, done) {
                  const user = {
                      id: profile.id,
                      displayName: profile.displayName,
                  }

                  req.user = user
                  return done(null, user)
              })
      )
  }
  next()
})

router.get(
  "/shopify",
  passport.authenticate("shopify")
)

router.get(
  "/shopify/callback",
  passport.authenticate("shopify", { failureRedirect: "http://www.google.com" }),
  function callback(req, res) {
    return req.login(req.user, async function callbackLogin(loginErr) {
      if (loginErr) {
        throw loginErr
      }
      return res.redirect("http://localhost:8000/welcome/?name=" + req.user.displayName)
      //return res.redirect("/welcome/?name=" + req.user.displayName)
    })
  }
)

export default router
