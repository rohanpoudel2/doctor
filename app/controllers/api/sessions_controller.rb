class Api::SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: %i[start end]

  before_action :set_session_data, only: [:end]

  def start
    session[:email] = params[:email]
    render json: { message: 'Session started and email stored temporarily' }, status: :ok
  end

  def end
    email = session.delete(:email)
    session_id = params[:session_id]

    if email && session_id
      user = User.find_or_create_by(email:)

      Session.create(user:, session_id:)

      ActionCable.server.broadcast('global_channel', {
                                     redirect_url: "#{root_path}?session_id=#{params[:session_id]}"
                                   })

      head :ok
    else
      render json: { error: 'Session data incomplete' }, status: :unprocessable_entity
    end
  end

  private

  def set_session_data
    @session_id = params[:session_id]
  end
end
