package requests

import (
	"strconv"
	"strings"

	"github.com/NdoleStudio/http-sms-manager/pkg/repositories"

	"github.com/NdoleStudio/http-sms-manager/pkg/services"
)

// MessageIndex is the payload fetching entities.Message sent between 2 numbers
type MessageIndex struct {
	Skip  string `json:"skip" query:"skip"`
	To    string `json:"to" query:"to"`
	From  string `json:"from" query:"from"`
	Query string `json:"query" query:"query"`
	Limit string `json:"limit" query:"limit"`
}

// Sanitize sets defaults to MessageOutstanding
func (input *MessageIndex) Sanitize() MessageIndex {
	if strings.TrimSpace(input.Limit) == "" {
		input.Limit = "20"
	}

	input.Query = strings.TrimSpace(input.Query)

	input.From = input.sanitizeAddress(input.From)
	input.To = input.sanitizeAddress(input.To)

	input.Skip = strings.TrimSpace(input.Skip)
	if input.Skip == "" {
		input.Skip = "0"
	}

	return *input
}

// ToGetParams converts request to services.MessageGetParams
func (input *MessageIndex) ToGetParams() services.MessageGetParams {
	return services.MessageGetParams{
		IndexParams: repositories.IndexParams{
			Skip:  input.getInt(input.Skip),
			Query: input.Query,
			Limit: input.getInt(input.Limit),
		},
		From: input.From,
		To:   input.To,
	}
}

// getLimit gets the take as a string
func (input *MessageIndex) sanitizeAddress(value string) string {
	value = strings.TrimRight(value, " ")
	if len(value) > 0 && value[0] == ' ' {
		value = strings.Replace(value, " ", "+", 1)
	}
	return value
}

// getLimit gets the take as a string
func (input *MessageIndex) getInt(value string) int {
	val, _ := strconv.Atoi(value)
	return val
}