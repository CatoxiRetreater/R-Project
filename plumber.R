# plumber.R

# Load required library
library(plumber)

# Add CORS support to allow HTML frontend requests
#* @filter cors
function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "*")
  if (req$REQUEST_METHOD == "OPTIONS") return(res)
  forward()
}

# Source the main script that contains all functions
source("movie_script.R")

#* @apiTitle Movie Sentiment Analysis API

#* Register a new user
#* @param name
#* @param email
#* @param password
#* @post /register
function(name, email, password, res) {
  result <- register_user(name, email, password)
  if (result$status) return(list(success=TRUE, message="Registered successfully"))
  res$status <- 400
  list(success=FALSE, message=result$message)
}

#* Login
#* @param email
#* @param password
#* @post /login
function(email, password, res) {
  result <- login_user(email, password)
  if (result$status) return(list(success=TRUE, name=result$name, token=result$token))
  res$status <- 401
  list(success=FALSE, message=result$message)
}

#* Continue as guest
#* @get /guest
function() {
  list(success=TRUE, name="Guest", token="guest-token")
}

#* Analyze sentiment of review
#* @param token
#* @param movie
#* @param review
#* @post /analyze
function(token, movie, review, res) {
  user <- get_user_from_token(token)
  if (is.null(user)) {
    res$status <- 401
    return(list(success=FALSE, message="Invalid token"))
  }
  sentiment_score <- predict_sentiment(review)
  aspects <- analyze_aspects_text(review)
  emotions <- analyze_emotions(review)
  list(success=TRUE, sentiment=sentiment_score, aspects=aspects, emotions=emotions)
}

#* Save review
#* @param token
#* @param movie
#* @param sentiment
#* @param aspects
#* @param emotions
#* @post /reviews
function(token, movie, sentiment, aspects, emotions, res) {
  user <- get_user_from_token(token)
  if (is.null(user) || user$email == "guest") {
    res$status <- 403
    return(list(success=FALSE, message="Guests cannot save reviews"))
  }
  save_user_review(user$email, movie, sentiment, aspects, emotions)
  list(success=TRUE, message="Review saved")
}

#* Get review history
#* @param token
#* @get /history
function(token, res) {
  user <- get_user_from_token(token)
  if (is.null(user) || user$email == "guest") {
    res$status <- 403
    return(list(success=FALSE, message="No history for guest"))
  }
  history <- view_review_history_json(user$email)
  list(success=TRUE, history=history)
}

#* Recommend movies
#* @param token
#* @param genre
#* @param current
#* @get /recommend
function(token, genre, current) {
  recs <- recommend_movies(movies_df, genre, current)
  list(success=TRUE, recommendations=recs)
}

# Only run the server if this is the main script
if (interactive()) {
  pr <- plumb("plumber.R")
  pr$run(port = 5500, host = "0.0.0.0")
}
