setwd("D:/UPES/SEM IV/FDS/R Project/Final Final")

library(tm)
library(caret)
library(ggplot2)
library(pROC)
library(e1071)
library(tidyverse)
library(RColorBrewer)
library(wordcloud)
library(syuzhet)
library(digest)

initialize_files <- function() {
  # Create credentials.csv if it doesn't exist
  if (!file.exists("credentials.csv")) {
    credentials <- data.frame(
      Name = character(),
      Email = character(),
      Password = character(),
      stringsAsFactors = FALSE
    )
    write.csv(credentials, "credentials.csv", row.names = FALSE)
    cat("Created credentials.csv file\n")
  }
  
  if (!file.exists("scores.csv")) {
    scores <- data.frame(
      Email = character(),
      Movie = character(),
      SentimentScore = numeric(),
      AspectScores = character(),
      Emotions = character(),
      ReviewDate = character(),
      stringsAsFactors = FALSE
    )
    write.csv(scores, "scores.csv", row.names = FALSE)
    cat("Created scores.csv file\n")
  }
}

initialize_files()

user_system <- function() {
  cat("\n User System \n")
  cat("1: Login\n")
  cat("2: Register\n")
  cat("3: Continue as Guest\n")
  
  choice <- as.integer(readline(prompt = "Enter your choice: "))
  
  if (choice == 1) {
    email <- tolower(trimws(readline(prompt = "Enter your email: ")))
    password <- readline(prompt = "Enter your password: ")
    
    hashed_password <- digest(password, algo = "md5")
    
    credentials <- read.csv("credentials.csv", stringsAsFactors = FALSE)
    
    user_row <- which(credentials$Email == email)
    
    if (length(user_row) > 0) {
      if (credentials$Password[user_row] == hashed_password) {
        cat("Login successful! Welcome back,", credentials$Name[user_row], "!\n")
        return(list(status = TRUE, email = email, name = credentials$Name[user_row]))
      } else {
        cat("Incorrect password. Please try again.\n")
        return(list(status = FALSE, email = NULL, name = NULL))
      }
    } else {
      cat("Email not found. Please register or try again.\n")
      return(list(status = FALSE, email = NULL, name = NULL))
    }
  } else if (choice == 2) {
    
    name <- readline(prompt = "Enter your name: ")
    email <- tolower(trimws(readline(prompt = "Enter your email: ")))
    password <- readline(prompt = "Create a password: ")
    
    hashed_password <- digest(password, algo = "md5")
    
    credentials <- read.csv("credentials.csv", stringsAsFactors = FALSE)
    
    if (email %in% credentials$Email) {
      cat("Email already registered. Please login or use a different email.\n")
      return(list(status = FALSE, email = NULL, name = NULL))
    }
    
    new_user <- data.frame(
      Name = name,
      Email = email,
      Password = hashed_password,
      stringsAsFactors = FALSE
    )
    
    credentials <- rbind(credentials, new_user)
    write.csv(credentials, "credentials.csv", row.names = FALSE)
    
    cat("Registration successful! Welcome,", name, "!\n")
    return(list(status = TRUE, email = email, name = name))
  } else {
    # Continue as guest
    cat("Continuing as guest...\n")
    return(list(status = TRUE, email = "guest", name = "Guest"))
  }
}

cat("Loading sentiment data and training model...\n")
sentiment_data <- read.csv("movie.csv", stringsAsFactors = FALSE)
sentiment_data$label <- factor(sentiment_data$label)

preprocess_text <- function(text) {
  corpus <- VCorpus(VectorSource(text))
  corpus_clean <- tm_map(corpus, content_transformer(tolower))
  corpus_clean <- tm_map(corpus_clean, removePunctuation)
  corpus_clean <- tm_map(corpus_clean, removeNumbers)
  corpus_clean <- tm_map(corpus_clean, removeWords, stopwords("english"))
  corpus_clean <- tm_map(corpus_clean, stripWhitespace)
  return(corpus_clean)
}

corpus <- preprocess_text(sentiment_data$text)

dtm <- DocumentTermMatrix(corpus)
sparse_dtm <- removeSparseTerms(dtm, 0.99)

data_features <- as.data.frame(as.matrix(sparse_dtm))
data_features$label <- sentiment_data$label

set.seed(123)
trainIndex <- createDataPartition(data_features$label, p = 0.8, list = FALSE)
train_data <- data_features[trainIndex, ]
test_data  <- data_features[-trainIndex, ]

cat("Training sentiment model...\n")
model <- glm(label ~ ., data = train_data, family = "binomial")

test_pred_prob <- predict(model, newdata = test_data, type = "response")
test_pred <- ifelse(test_pred_prob > 0.5, 1, 0)
test_actual <- as.numeric(as.character(test_data$label))

conf_mat <- confusionMatrix(factor(test_pred), factor(test_actual))
cat("Model training complete!\n")
cat("Accuracy:", round(conf_mat$overall["Accuracy"] * 100, 2), "%\n")

analyze_aspects <- function() {
  aspects <- c(
    "Acting performance",
    "Plot coherence",
    "Visual effects",
    "Soundtrack/Music",
    "Character development",
    "Dialogue quality",
    "Cinematography",
    "Pacing",
    "Story originality",
    "Direction",
    "Production value",
    "Emotional impact",
    "Thematic depth",
    "Entertainment value",
    "Overall experience"
  )
  
  responses <- c("Yes", "No", "Maybe")
  
  aspects_scores <- numeric(length(aspects))
  
  cat("\n Aspect-Based Analysis \n")
  cat("Please answer the following questions about specific aspects of the movie.\n")
  cat("Answer with: Yes (3 points), Maybe (2 points), or No (1 point)\n\n")
  
  for (i in 1:length(aspects)) {
    valid_response <- FALSE
    while (!valid_response) {
      cat(paste0(i, ": Did you enjoy the ", aspects[i], "? "))
      response <- trimws(toupper(substring(readline(), 1, 1)))
      
      if (response == "Y") {
        aspects_scores[i] <- 3
        valid_response <- TRUE
      } else if (response == "M") {
        aspects_scores[i] <- 2
        valid_response <- TRUE
      } else if (response == "N") {
        aspects_scores[i] <- 1
        valid_response <- TRUE
      } else {
        cat("Invalid response. Please enter Yes, No, or Maybe.\n")
      }
    }
  }
  
  aspect_score <- (sum(aspects_scores) - length(aspects)) / (2 * length(aspects))
  
  aspects_list <- setNames(aspects_scores, aspects)
  
  return(list(
    aspect_score = aspect_score,
    aspects_detail = aspects_list
  ))
}

analyze_emotions <- function(review_text) {
  emotions <- get_nrc_sentiment(review_text)
  
  emotion_sums <- colSums(emotions)
  emotion_sums <- emotion_sums / sum(emotion_sums)
  
  emotion_cols <- setdiff(names(emotion_sums), c("positive", "negative"))
  filtered_emotions <- emotion_sums[emotion_cols]
  
  top_emotions <- names(sort(filtered_emotions, decreasing = TRUE)[1:3])
  
  return(list(
    emotion_scores = filtered_emotions,
    top_emotions = top_emotions
  ))
}

recommend_movies <- function(movies_df, genre, current_movie, count = 10) {
  filtered_movies <- movies_df[grepl(paste0("\\b", genre, "\\b"), movies_df$genre, ignore.case = TRUE), ]
  
  filtered_movies <- filtered_movies[filtered_movies$title != current_movie, ]
  
  available_count <- min(nrow(filtered_movies), count)
  
  if (available_count == 0) {
    return(character(0))
  }
  
  recommended <- sample(filtered_movies$title, available_count)
  
  return(recommended)
}

save_user_review <- function(email, movie, sentiment_score, aspect_scores, emotions) {
  if (email == "guest") {
    cat("Guest users cannot save reviews. Please register to save your reviews.\n")
    return(FALSE)
  }
  
  scores <- read.csv("scores.csv", stringsAsFactors = FALSE)
  
  new_score <- data.frame(
    Email = email,
    Movie = movie,
    SentimentScore = sentiment_score,
    AspectScores = paste(names(aspect_scores), aspect_scores, sep = ":", collapse = "|"),
    Emotions = paste(emotions, collapse = "|"),
    ReviewDate = format(Sys.time(), "%Y-%m-%d %H:%M:%S"),
    stringsAsFactors = FALSE
  )
  
  scores <- rbind(scores, new_score)
  
  write.csv(scores, "scores.csv", row.names = FALSE)
  
  cat("Review saved successfully!\n")
  return(TRUE)
}

visualize_sentiment <- function(review_sentiment, aspect_scores, emotions, conf_level = NULL) {
  cat("\n Visualization Options \n")
  cat("1: Aspect scores radar chart\n")
  cat("2: Emotion distribution bar chart\n")
  cat("3: Overall sentiment gauge\n")
  cat("4: All visualizations\n")
  cat("0: None\n")
  
  vis_choice <- as.integer(readline(prompt = "Enter your choice: "))
  
  if (vis_choice == 0) {
    return()
  }
  
  if (vis_choice == 1 || vis_choice == 4) {
    # Convert aspect scores to data frame
    aspects_df <- data.frame(
      Aspect = names(aspect_scores),
      Score = as.numeric(aspect_scores)
    )
    
    ggplot(aspects_df, aes(x = Aspect, y = Score)) +
      geom_bar(stat = "identity", fill = "steelblue") +
      coord_polar() +
      theme_minimal() +
      theme(axis.text.x = element_text(angle = 45)) +
      labs(title = "Aspect Scores Radar Chart")
  }
  
  if (vis_choice == 2 || vis_choice == 4) {
    # Convert emotions to data frame
    emotions_df <- data.frame(
      Emotion = names(emotions$emotion_scores),
      Score = as.numeric(emotions$emotion_scores)
    )
    
    emotions_df <- emotions_df[order(-emotions_df$Score), ]
    
    # Create bar chart
    ggplot(emotions_df, aes(x = reorder(Emotion, -Score), y = Score)) +
      geom_bar(stat = "identity", fill = "coral") +
      theme_minimal() +
      theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
      labs(title = "Emotion Distribution", x = "Emotion", y = "Score")
  }
  
  if (vis_choice == 3 || vis_choice == 4) {
    # Create dataframe for sentiment score
    sentiment_df <- data.frame(
      Type = c("Negative", "Review Score", "Positive"),
      Score = c(0, review_sentiment, 1)
    )
    
    ggplot(sentiment_df, aes(x = Type, y = Score, fill = Type)) +
      geom_bar(stat = "identity") +
      scale_fill_manual(values = c("red", "yellow", "green")) +
      theme_minimal() +
      labs(title = "Sentiment Score Gauge", x = "", y = "Score")
  }
}

view_review_history <- function(email) {
  if (email == "guest") {
    cat("Guest users don't have review history. Please register to save your reviews.\n")
    return()
  }
  
  scores <- read.csv("scores.csv", stringsAsFactors = FALSE)
  
  user_scores <- scores[scores$Email == email, ]
  
  if (nrow(user_scores) == 0) {
    cat("You haven't reviewed any movies yet.\n")
    return()
  }
  
  cat("\n Your Review History \n")
  for (i in 1:nrow(user_scores)) {
    cat(paste0(i, ": ", user_scores$Movie[i], " - Score: ", 
               round(user_scores$SentimentScore[i] * 10), "/10",
               " (", user_scores$ReviewDate[i], ")\n"))
  }
  
  detail_choice <- as.integer(readline(prompt = "Enter review number to see details (0 to skip): "))
  
  if (detail_choice > 0 && detail_choice <= nrow(user_scores)) {
    selected <- user_scores[detail_choice, ]
    
    cat("\n Review Details \n")
    cat("Movie:", selected$Movie, "\n")
    cat("Overall Score:", round(selected$SentimentScore * 10), "/10\n")
    cat("Review Date:", selected$ReviewDate, "\n")
    
    aspects <- strsplit(selected$AspectScores, "\\|")[[1]]
    cat("\nAspect Scores:\n")
    for (aspect in aspects) {
      parts <- strsplit(aspect, ":")[[1]]
      cat("- ", parts[1], ": ", parts[2], "\n", sep = "")
    }
    
    emotions <- strsplit(selected$Emotions, "\\|")[[1]]
    cat("\nTop Emotions: ", paste(emotions, collapse = ", "), "\n")
  }
}

calculate_confidence <- function(features, model) {
  pred_prob <- predict(model, newdata = features, type = "response")
  
  confidence <- abs(pred_prob - 0.5) * 2
  
  coefs <- coef(model)
  coefs <- coefs[!is.na(coefs)]
  
  top_coefs <- sort(abs(coefs), decreasing = TRUE)[1:10]
  top_features <- names(top_coefs)
  
  top_features <- top_features[top_features != "(Intercept)"]
  
  return(list(
    confidence = confidence,
    top_features = top_features
  ))
}

run_movie_sentiment_analysis <- function() {
  cat(" Movie Review Sentiment Analysis System \n")
  
  user <- user_system()
  
  if (!user$status) {
    cat("Authentication failed. Please try again.\n")
    return()
  }
  
  while (TRUE) {
    cat("\n Main Menu \n")
    cat("1: Review a movie\n")
    cat("2: View review history\n")
    cat("3: Compare multiple movies\n")
    cat("4: Exit\n")
    
    main_choice <- as.integer(readline(prompt = "Enter your choice: "))
    
    if (main_choice == 1) {
      
      movies <- read.csv("movie_names.csv", stringsAsFactors = FALSE)
      movies$genre <- tolower(trimws(movies$genre))
      
      genre_input <- tolower(trimws(readline(prompt = "Enter your preferred genre: ")))
      
      pattern <- paste0("\\b", genre_input, "\\b")
      movies_filtered <- movies[grepl(pattern, movies$genre, ignore.case = TRUE), ]
      
      if (nrow(movies_filtered) == 0) {
        cat("No movie found for the given genre. Please try another genre.\n")
        next
      }
      
      cat("Generating a random movie from", genre_input, "genre...\n")
      
      selected_movie <- sample(movies_filtered$title, 1)
      cat("Your movie is:", selected_movie, "\n")
      
      review_input <- readline(prompt = paste("Enter your review for", selected_movie, ": "))
      
      review_corpus <- preprocess_text(review_input)
      review_dtm <- DocumentTermMatrix(review_corpus, control = list(dictionary = Terms(sparse_dtm)))
      review_features <- as.data.frame(as.matrix(review_dtm))
      
      missing_cols <- setdiff(names(train_data)[-ncol(train_data)], names(review_features))
      if (length(missing_cols) > 0) {
        for (col in missing_cols) {
          review_features[[col]] <- 0
        }
      }
      review_features <- review_features[, names(train_data)[-ncol(train_data)]]
      
      review_pred_prob <- predict(model, newdata = review_features, type = "response")
      review_sentiment <- review_pred_prob  # Score from 0 to 1
      sentiment_label <- ifelse(review_pred_prob > 0.5, "Positive", "Negative")
      
      cat("\n Initial Sentiment Analysis \n")
      cat("Your review sentiment:", sentiment_label, "\n")
      cat("Sentiment score:", round(review_sentiment * 10), "out of 10\n")
      
      aspects_analysis <- analyze_aspects()
      
      emotions_analysis <- analyze_emotions(review_input)
      
      combined_score <- (review_sentiment + aspects_analysis$aspect_score) / 2
      
      cat("\n Complete Sentiment Analysis \n")
      cat("Overall sentiment score:", round(combined_score * 10), "out of 10\n")
      
      cat("Top emotions detected:", paste(emotions_analysis$top_emotions, collapse = ", "), "\n")
      
      confidence_choice <- tolower(substring(readline(prompt = "Do you want to see confidence metrics? (y/n): "), 1, 1))
      
      if (confidence_choice == "y") {
        confidence <- calculate_confidence(review_features, model)
        
        cat("\n Confidence Metrics \n")
        cat("Prediction confidence:", round(confidence$confidence * 100, 2), "%\n")
        cat("Top influential features in your review:\n")
        for (i in 1:min(5, length(confidence$top_features))) {
          feature <- confidence$top_features[i]
          if (feature %in% colnames(review_features)) {
            cat("- ", feature, "\n", sep = "")
          }
        }
      }
      
      cat("\n Movie Recommendations \n")
      recommendations <- recommend_movies(movies, genre_input, selected_movie)
      
      if (length(recommendations) > 0) {
        cat("You might also enjoy these movies:\n")
        for (i in 1:length(recommendations)) {
          cat(paste0(i, ": ", recommendations[i], "\n"))
        }
      } else {
        cat("No additional recommendations found for this genre.\n")
      }
      
      save_user_review(
        user$email, 
        selected_movie, 
        combined_score, 
        aspects_analysis$aspects_detail, 
        emotions_analysis$top_emotions
      )
      
      visualize_choice <- tolower(substring(readline(prompt = "Would you like to see visualizations? (y/n): "), 1, 1))
      
      if (visualize_choice == "y") {
        visualize_sentiment(combined_score, aspects_analysis$aspects_detail, emotions_analysis)
      }
      
    } else if (main_choice == 2) {
      view_review_history(user$email)
      
    } else if (main_choice == 3) {
      cat("\n Movie Comparison \n")
      
      if (user$email != "guest") {
        scores <- read.csv("scores.csv", stringsAsFactors = FALSE)
        user_scores <- scores[scores$Email == user$email, ]
        
        if (nrow(user_scores) < 2) {
          cat("You need to have reviewed at least 2 movies to compare. Please review more movies.\n")
          next
        }
        
        cat("Your reviewed movies:\n")
        for (i in 1:nrow(user_scores)) {
          cat(paste0(i, ": ", user_scores$Movie[i], " - Score: ", 
                     round(user_scores$SentimentScore[i] * 10), "/10\n"))
        }
        
        cat("Select movies to compare (comma-separated numbers, e.g., 1,3): ")
        selections <- as.numeric(unlist(strsplit(readline(), ",")))
        
        if (length(selections) < 2) {
          cat("You need to select at least 2 movies to compare.\n")
          next
        }
        
        valid_selections <- selections[selections > 0 & selections <= nrow(user_scores)]
        
        if (length(valid_selections) < 2) {
          cat("You need to select at least 2 valid movies to compare.\n")
          next
        }
        
        selected_movies <- user_scores[valid_selections, ]
        
        cat("\n Movie Comparison Results \n")
        
        comparison_df <- data.frame(
          Movie = selected_movies$Movie,
          Score = round(selected_movies$SentimentScore * 10, 1)
        )
        
        for (i in 1:nrow(comparison_df)) {
          cat(comparison_df$Movie[i], ": ", comparison_df$Score[i], "/10\n", sep = "")
        }
        
        ggplot(comparison_df, aes(x = Movie, y = Score, fill = Movie)) +
          geom_bar(stat = "identity") +
          theme_minimal() +
          theme(axis.text.x = element_text(angle = 45, hjust = 1)) +
          labs(title = "Movie Comparison", x = "", y = "Score (out of 10)")
      } else {
        cat("Guest users cannot compare movies. Please register to use this feature.\n")
      }
      
    } else if (main_choice == 4) {
      cat("Thank you for using the Movie Review Sentiment Analysis System!\n")
      break
    } else {
      cat("Invalid choice. Please try again.\n")
    }
  }
}

run_movie_sentiment_analysis()