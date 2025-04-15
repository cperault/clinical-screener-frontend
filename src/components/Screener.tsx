import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  LinearProgress,
  Paper,
  Stack,
  Skeleton,
  Alert,
  IconButton,
} from "@mui/material";

import { Screener as ScreenerType } from "../types/screener";
import { v4 as uuidv4 } from "uuid";
import InfoIcon from "@mui/icons-material/Info";
import apiCall from "../utils/api";

const ASSESSMENT_INFO: Record<string, string> = {
  "PHQ-9":
    "The Patient Health Questionnaire-9 (PHQ-9) is a standardized questionnaire used to screen, diagnose, and monitor both depression and anxiety symptoms. It helps clinicians assess the severity of these conditions and track changes over time.",
  ASRM: "The Altman Self-Rating Mania Scale (ASRM) is a brief questionnaire used to assess symptoms of mania and hypomania.",
  ASSIST:
    "The Alcohol, Smoking and Substance Involvement Screening Test (ASSIST) is a brief screening tool for substance use and related problems.",
};

export const Screener = () => {
  const [screener, setScreener] = useState<ScreenerType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchScreener();
    setSessionId(uuidv4());
  }, []);

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, [currentQuestionIndex, isComplete, error]);

  const fetchScreener = async () => {
    try {
      setLoading(true);
      const response = await apiCall("/screener");

      if (!response.ok) {
        throw new Error("Failed to fetch screener");
      }

      const data = await response.json();
      setScreener(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent, value: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleAnswer(value);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }} role="alert" aria-live="polite" aria-busy="true">
          <Stack spacing={3} alignItems="center">
            <Typography variant="h6" id="loading-heading" align="center">
              Loading diagnostic screener...
            </Typography>
            <Skeleton variant="rectangular" height={4} sx={{ borderRadius: 2, width: "80%" }} />
            <Skeleton variant="text" height={32} width="80%" />
            <Skeleton variant="text" height={24} width="60%" />
            <Skeleton variant="text" height={20} width="40%" />
            <Skeleton variant="text" height={28} width="90%" />
            <Stack spacing={2} width="100%" alignItems="center">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="rectangular" height={56} sx={{ borderRadius: 1, width: "100%" }} />
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }} role="alert" aria-live="assertive">
          <Stack spacing={2} alignItems="center">
            <Typography color="error" align="center" id="error-message">
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchScreener}
              aria-label="Retry loading the diagnostic screener"
            >
              Retry
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (!screener) return null;

  const currentQuestion = screener.content.sections[0].questions[currentQuestionIndex];
  const totalQuestions = screener.content.sections[0].questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswer = async (value: number) => {
    if (isComplete) return;

    const newAnswers = {
      ...answers,
      [currentQuestion.question_id]: value,
    };

    setAnswers(newAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const formattedAnswers = Object.entries(newAnswers).map(([question_id, value]) => ({
        question_id,
        value,
      }));

      try {
        const response = await apiCall("/answers", {
          method: "POST",
          body: JSON.stringify({
            session_id: sessionId,
            answers: formattedAnswers,
            isComplete: true,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to submit answers");
        }

        const result = await response.json();
        setResults(result.results);
        setIsComplete(true);
      } catch (error) {
        console.error("Error submitting answers:", error);
        setError("Failed to submit answers. Please try again.");
      }
    }
  };

  if (isComplete) {
    return (
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{ p: 4, mt: 4 }}
          role="region"
          aria-label="Diagnostic screener results"
          ref={mainContentRef}
          tabIndex={-1}
        >
          <Stack spacing={3}>
            <Typography variant="h5" color="primary" align="center" component="h1">
              Screener Completed
            </Typography>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
              role="status"
              aria-live="polite"
            >
              <Box
                component="span"
                sx={{
                  color: "success.main",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
                </svg>
              </Box>
              <Typography align="center">Thank you for completing the diagnostic screener.</Typography>
            </Box>

            <Box sx={{ mt: 2 }} role="region" aria-labelledby="recommendations-heading">
              <Typography
                variant="h6"
                color="text.secondary"
                gutterBottom
                id="recommendations-heading"
                component="h2"
                align="left"
              >
                Recommended Assessments:
              </Typography>
              <Stack spacing={1} role="list">
                {results.map((assessment) => (
                  <Box
                    key={assessment}
                    role="listitem"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      bgcolor: "background.paper",
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    <Typography color="primary">{assessment}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        if (assessment && ASSESSMENT_INFO[assessment]) {
                          alert(ASSESSMENT_INFO[assessment]);
                        }
                      }}
                      aria-label={`Learn more about ${assessment}`}
                      sx={{ color: "text.secondary" }}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Box>
                ))}
                {results.length === 0 && (
                  <Box
                    role="listitem"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.5,
                      bgcolor: "background.paper",
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1,
                    }}
                  >
                    <Typography color="text.primary">No additional assessments recommended at this time.</Typography>
                  </Box>
                )}
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }} align="center">
              Please consult with your healthcare provider about these results.
            </Typography>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{ p: 4, mt: 4 }}
        role="region"
        aria-label="Diagnostic screener questions"
        ref={mainContentRef}
        tabIndex={-1}
      >
        <Typography
          variant="h5"
          color="text.secondary"
          component="h2"
          align="center"
          sx={{
            fontWeight: 400,
            mb: 3,
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
            lineHeight: 1.4,
          }}
        >
          {screener.content.display_name}
        </Typography>

        <Box
          sx={{ width: "100%", mb: 4 }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: ${Math.round(progress)}%`}
        >
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        <Stack spacing={3} alignItems="center">
          <Typography
            variant="h4"
            color="text.secondary"
            component="h1"
            align="center"
            sx={{
              fontWeight: 500,
              mb: 2,
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              lineHeight: 1.3,
            }}
          >
            {screener.content.sections[0].title}
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            id="current-question"
            align="center"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              mb: 3,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              lineHeight: 1.5,
            }}
          >
            {currentQuestion.title}
          </Typography>

          <Stack
            spacing={2}
            role="radiogroup"
            aria-labelledby="current-question"
            aria-describedby="question-counter"
            width="100%"
          >
            {screener.content.sections[0].answers.map((answer) => (
              <Button
                key={answer.value}
                variant="outlined"
                size="large"
                onClick={() => handleAnswer(answer.value)}
                onKeyPress={(e) => handleKeyPress(e, answer.value)}
                role="radio"
                aria-checked={answers[currentQuestion.question_id] === answer.value}
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  py: 2,
                  px: 3,
                  "&:focus": {
                    outline: "2px solid #1976d2",
                    outlineOffset: "2px",
                  },
                }}
              >
                {answer.title}
              </Button>
            ))}
          </Stack>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            id="question-counter"
            align="center"
            sx={{
              mt: 3,
            }}
          >
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};
